import { NextResponse } from 'next/server';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ... (Firebase config - ensure environment variables are set) ...

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req) {
  try {
    const data = await req.json();

    // Input validation
    if (!data.image || !data.capturedAt || !data.capImage) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields: image, capturedAt, capImage' }), { status: 400 });
    }
    // Add more robust validation as needed (data types, image size limits, etc.)

    await addDoc(collection(db, "signatures"), { data });

    return new NextResponse(JSON.stringify({ message: 'Signature saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error saving signature:", error); // Log the full error for debugging

    let errorMessage = 'Failed to save signature';
    if (error.code) { // Check if Firestore error code is available
      switch (error.code) {
        case 'permission-denied':
          errorMessage = 'Insufficient permissions to write to Firestore.';
          break;
        case 'failed-precondition':
          errorMessage = 'A precondition for the operation failed.';
          break;
        case 'out-of-range':
          errorMessage = 'The request is out of range.';
          break;
        case 'unavailable':
          errorMessage = 'Firestore is currently unavailable.';
          break;
        // Add more cases for other Firestore error codes as needed
        default:
          errorMessage = `Firestore Error: ${error.code} - ${error.message}`; // Include the code and message for unknown errors
      }
    } else {
        errorMessage = `Unexpected error: ${error.message}`; // Handle other errors appropriately
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
