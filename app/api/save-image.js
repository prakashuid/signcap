import { NextResponse } from 'next/server';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


// Firebase configuration (replace with your actual config)
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


export async function POST(request) {
  try {
    const { signature, capturedImage, capturedAt } = await request.json();

    // Firebase addDoc operation
    await addDoc(collection(db, "item"), {
        signature,
        capturedImage,
        capturedAt,
    });

    return NextResponse.json({ message: 'Signature saved successfully' });
  } catch (error) {
    console.error('Error saving signature:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

