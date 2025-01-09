import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";

export default function Provider({ children }) {
  return (
    <NextUIProvider className="bg-gradient-to-r from-teal-400 to-yellow-200">
      {children}
    </NextUIProvider>
  );
}