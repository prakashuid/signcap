"use client";
import Image from "next/image";
import { Avatar, AvatarGroup, User, Button } from "@nextui-org/react";
import confetti from "canvas-confetti";
import SignaturePad from "./SignaturePad/page";
import { useState } from "react";

export default function Home() {
  const [imgUrl, setImageURL] = useState(null);
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  const handleConfetti = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };
  return (
    <div className="">
      <h1 className="text-center text-4xl font-bold">
        App moved into below URLs
      </h1>
      <p>Please checkout New Design!</p>

      <div className="flex justify-center">
        <a
          class="cta btn btn-primary shadow-sm"
          id="Prakash"
          href="https://signature-cap.vercel.app/"
        >
          {" "}
          Capture the Image{" "}
        </a>
        <a
          class="cta btn btn-primary shadow-sm"
          id="Prakash"
          href="https://show-sign.vercel.app/"
        >
          {" "}
          Display the Image{" "}
        </a>
      </div>
    </div>
  );
}
