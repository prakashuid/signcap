import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Ensure body contains the necessary fields
    const { image, capImage } = body;
    
    // Validate the input data
    if (!image || !capImage) {
      console.error('Invalid input data');
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Use upload to manage the upload process
    const jsonResponse = await put({
      body: { image, capImage },  // Make sure to provide the body parameter
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate and authorize users before generating the token
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({
            capturedAt, // Include any additional information you need
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Blob upload completed', blob, tokenPayload);

        try {
          // Optional logic after the file upload completed
          // Example: Update database records with blob URLs
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          console.error('Error updating user records:', error);
          throw new Error('Could not update user');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error during upload process:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
