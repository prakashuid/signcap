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
      <SignaturePad setImageURL={setImageURL} />
    </div>
  );
}
