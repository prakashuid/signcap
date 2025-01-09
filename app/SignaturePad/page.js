"use client";

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Switch } from "@nextui-org/react";
import confetti from 'canvas-confetti';

export default function SignaturePad() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sigCanvas = useRef({});
  const [camCapture, setCamCapture] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSelected, setIsSelected] = useState(true);
  const [isSelectedSign,setIsSelectedSign] =useState(true);
  let stream = useRef(null); // Use ref to hold the media stream

  const confettiDefaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };

  useEffect(() => {
    if (isSelected) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isSelected]);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        stream.current = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream.current;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert(`Webcam error: ${error.message}`);
      }
    } else {
      console.error("getUserMedia is not supported on this browser.");
      alert("Your browser does not support accessing the webcam.");
    }
  };

  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      console.error("No active stream to stop.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
    return null;
  };

  const handleConfetti = () => {
    confetti({
      ...confettiDefaults,
      particleCount: 140,
      scalar: 2.2,
      shapes: ['star']
    });

    confetti({
      ...confettiDefaults,
      particleCount: 110,
      scalar: 0.75,
      shapes: ['circle']
    });
  };

  const saveSignature = async () => {
    handleConfetti();
    const imageData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    const capImage = captureImage();

    const newSignature = {
      image: imageData,
      capturedAt: new Date().toISOString(),
      capImage,
    };

    try {
      const response = await fetch('/api/save-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSignature),
      });

      if (response.ok) {
        sigCanvas.current.clear();
      } else {
        console.error('Failed to upload signature');
      }
    } catch (error) {
      console.error('Error uploading signature:', error);
    }
  };

  return (
    <div>
      <div className="container flex flex-col">
        <div className="flex flex-col items-center">
          <div>
            {camCapture && (
              <div className="absolute left-72 ml-[6px] -mt-6">
                <video ref={videoRef} autoPlay style={{ width: 200, height: 200 }} />
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
           
           {isSelectedSign && ( <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 1024, height: 386, className: "sigCanvas" }} />)}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            color="secondary"
            onClick={() => sigCanvas.current.clear()}
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Clear Signature
          </Button>
          <Button
            type="button"
            onClick={saveSignature}
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Save Signature
          </Button>
          <Button onPress={onOpen}>Animation</Button>
        </div>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
              <DrawerBody>
                <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                  With image
                </Switch>
                <Switch isSelected={isSelectedSign} onValueChange={setIsSelectedSign}>
                  With Signature
                </Switch>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                  deserunt nostrud ad veniam.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
