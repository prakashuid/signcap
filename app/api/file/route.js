import { put, getBlob } from "@vercel/blob";
import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
export async function POST(req) {
  try {
    const body = await req.json();
    const { image, capImage } = body;
    const imageBuffer = Buffer.from(image, "base64");
    const capImageBuffer = Buffer.from(capImage, "base64");
    const signatureResponse = await put("signature.png", imageBuffer, {
      contentType: "image/png",
      access: "public",
    });
    const capImageResponse = await put("captured.png", capImageBuffer, {
      contentType: "image/png",
      access: "public",
    });

    return NextResponse.json({ capImageResponse, signatureResponse });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      status: 500,
    });
  }
}

export async function GET(request) {
  const { blobs } = await list();
  return Response.json(blobs);
}
