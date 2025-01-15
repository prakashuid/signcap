import { put } from '@vercel/blob';

export async function POST(req) {
  try {
    const body = await req.json();
    const { image, capImage } = body;

    // Prepare the data to be uploaded
    const imageBuffer = Buffer.from(image, 'base64');
    const capImageBuffer = Buffer.from(capImage, 'base64');

    // Upload the signature image
    const signatureResponse = await put('signature.png', imageBuffer, {
      contentType: 'image/png',
      access: 'public',
    });

    // Upload the captured image
    const capImageResponse = await put('captured.png', capImageBuffer, {
      contentType: 'image/png',
      access: 'public',
    });

    // Return a JSON response
    return new Response(JSON.stringify({
      message: 'Upload successful',
      signatureUrl: signatureResponse.url,
      capImageUrl: capImageResponse.url,
    }), { status: 200 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), { status: 500 });
  }
}
