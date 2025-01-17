"use client";

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Image,
  Switch,
} from "@nextui-org/react";
import confetti from "canvas-confetti";
import { Camera } from "react-camera-pro";

export default function SignaturePad() {
  const canvasRef = useRef(null);
  const sigCanvas = useRef();
  const camera = useRef(null);

  const [camCapture, setCamCapture] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSelected, setIsSelected] = useState(true);
  const [isSelectedSign, setIsSelectedSign] = useState(true);
  const [isSignatureReady, setIsSignatureReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [ratio, setRatio] = useState(2 / 2);

  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  useEffect(() => {
    if (sigCanvas.current) {
      setIsSignatureReady(true);
    }
  }, [sigCanvas]);

  const signature =
    "https://my-blob-store.public.blob.vercel-storage.com/signature-1633660730000-100000000.png";

  const capture = () => {
    const imageSrc = camera.current.takePhoto();
    rotateImage(imageSrc, 90, (rotatedImage) => {
      // Remove the prefix to match the format of imageData
      const base64Data = rotatedImage.split(",")[1];
      setImage(base64Data);
    });
  };

  const rotateImage = (imageBase64, rotation, cb) => {
    const img = new window.Image(); // Use the global Image constructor
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      cb(canvas.toDataURL("image/jpeg"));
    };
  };

  const imageCamera = {
    position: "absolute",
    bottom: "10%",
  };

  const handleConfetti = () => {
    confetti({
      ...confettiDefaults,
      particleCount: 140,
      scalar: 2.2,
      shapes: ["star"],
    });

    confetti({
      ...confettiDefaults,
      particleCount: 110,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };

  //  const saveSignature = async () => {
  //   handleConfetti();

  //   // Capture the image first
  //   const capturePromise = new Promise((resolve, reject) => {
  //     const imageSrc = camera.current.takePhoto();
  //     rotateImage(imageSrc, 90, (rotatedImage) => {
  //       if (rotatedImage) {
  //         setImage(rotatedImage.replace("data:image/jpeg;base64,:", ""));
  //         resolve(rotatedImage);
  //       } else {
  //         reject(new Error("Failed to capture image"));
  //       }
  //     });
  //   });

  //   try {
  //     const capturedImage = await capturePromise;
  //     const imageData = sigCanvas.current
  //       .getTrimmedCanvas()
  //       .toDataURL("image/png")
  //       .split(",")[1];

  // console.log("Captured image:",  capturedImage.replace("data:image/jpeg;base64,:", ""));
  // console.log("Signature image:", imageData);
  //     const newSignature = {
  //       image: imageData,
  //       capImage: capturedImage
  //     };

  //     const response = await fetch("/api/file", {
  //       method: "POST",
  //       body: JSON.stringify(newSignature),
  //     });

  //     if (response.ok) {
  //       await response.json();
  //       sigCanvas.current.clear();
  //     } else {
  //       console.error("Failed to upload signature");
  //     }
  //   } catch (error) {
  //     console.error("Error capturing or uploading signature:", error);
  //   }
  // };

  const saveSignature = async () => {
    handleConfetti();

    try {
      // Capture the image
      const imageSrc = camera.current.takePhoto();
      const rotatedImage = await new Promise((resolve, reject) => {
        rotateImage(imageSrc, 90, (result) => {
          const base64Data = result.split(",")[1]; // Extract Base64 data
          if (base64Data) {
            resolve(base64Data);
          } else {
            reject(new Error("Failed to capture image"));
          }
        });
      });

      const imageData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png")
        .split(",")[1];

      console.log("Captured image:", rotatedImage);
      console.log("Signature image:", imageData);

      const newSignature = {
        image: imageData,
        capImage: rotatedImage,
      };

      const response = await fetch("/api/file", {
        method: "POST",
        body: JSON.stringify(newSignature),
      });

      if (response.ok) {
        await response.json();
        sigCanvas.current.clear();
      } else {
        console.error("Failed to upload signature");
      }
    } catch (error) {
      console.error("Error capturing or uploading signature:", error);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    } else {
      console.error("Signature canvas is not initialized.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-3 gap-4">
        <div className="row-span-3 bg bg-gray-100 p-4 rounded-lg">
          <Image src={signature} alt="signature" width={300} height={386} />
        </div>
        <div
          className="rounded-lg border border-gray-200 rounded-lg "
          style={{ zIndex: "9999 !important" }}
        >
          <Camera
            ref={camera}
            numberOfCamerasCallback={setNumberOfCameras}
            facingMode="user"
            aspectRatio={ratio}
          />
        </div>

        <div className="row-span-2 col-start-2 row-start-2 bg bg-gray-100 p-4 rounded-lg z-10">
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {isSelectedSign && (
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 300,
                height: 386,
                className: "sigCanvas",
              }}
            />
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              color="secondary"
              onPress={clearSignature}
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Clear Signature
            </Button>
            <Button
              type="button"
              onPress={() => {
                saveSignature();
                capture();
              }}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Save Signature
            </Button>
            <Button onPress={onOpen}>Animation</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
