import { NextResponse } from 'next/server';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req) {
  try {
    const data = await req.json();

    // Input validation (enhanced)
    if (!data.image || !data.capturedAt || !data.capImage) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields: image, capturedAt, capImage' }), { status: 400 });
    }
    if (typeof data.image !== 'string' || typeof data.capImage !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'image and capImage must be strings (base64 encoded)' }), { status: 400 });
    }
    try {
      new Date(data.capturedAt); // Check if it's a valid date string
    } catch (dateError) {
      return new NextResponse(JSON.stringify({ error: 'Invalid capturedAt date format' }), { status: 400 });
    }


    await addDoc(collection(db, "signatures"), data);
    
    return new NextResponse(JSON.stringify({ message: 'Signature saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error saving signature:", error); 

    //Improved error handling for better client feedback
    let errorMessage = 'Failed to save signature';
    if (error.code) {
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
        case 'invalid-argument':
          errorMessage = 'Invalid data provided to Firestore. Check data types and structure.';
          break;
        default:
          errorMessage = `Firestore Error: ${error.code} - ${error.message}`;
      }
    } else if (error.message) {
      errorMessage = `Unexpected error: ${error.message}`;
    } else {
      errorMessage = "An unknown error occurred.";
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500, //Consider using 400 for client-side errors
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
