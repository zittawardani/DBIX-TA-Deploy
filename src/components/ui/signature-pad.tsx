"use client";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
    onSave("");
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL("image/png");
      onSave(signature);
      setIsEmpty(sigCanvas.current.isEmpty());
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-[450px] mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">E-Signature</h2>
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 400,
            height: 200,
            className: "rounded-lg",
          }}
          onEnd={handleEnd}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 transition"
        >
          Clear and Draw Again
        </button>
      </div>
    </div>
  );
}
