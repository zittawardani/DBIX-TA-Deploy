import React, { useState, useCallback, SetStateAction, Dispatch } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../button";
import { Image } from "lucide-react";

const UploadImageDiscuss = ({
  isOpen,
  onClose,
  image,
  setImage,
  handleUploadImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  image: File[];
  setImage: Dispatch<SetStateAction<File[]>>;
  handleUploadImage: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validasi tipe file
        if (!file.type.startsWith("image/")) {
          setError("Harap unggah file gambar.");
          return;
        }

        // Validasi ukuran file (maksimum 1MB)
        if (file.size > 1024 * 1024) {
          setError("Ukuran file terlalu besar! Maksimum 1MB.");
          return;
        }

        setImage(acceptedFiles);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [] },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Image</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 rounded-lg mb-4 text-center cursor-pointer ${
            isDragActive ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className="mb-2">
              <Image />
            </div>
            {image.length > 0 ? (
              <p className="text-gray-500">{image[0].name}</p>
            ) : (
              <>
                <p className="text-gray-500 mb-1">Attach File</p>
                <p className="text-gray-400">or Drag & Drop</p>
              </>
            )}
          </div>
        </div>

        {/* 🔹 Tampilkan error jika ada */}
        {error && (
          <div className="text-red-500 text-center mb-2 p-2 border border-red-400 rounded bg-red-100">
            {error}
          </div>
        )}

        <Button
          onClick={handleUploadImage}
          className="w-full"
          disabled={!!error || image.length === 0}
        >
          Send
        </Button>
        <Button
          onClick={() => {
            onClose();
            setImage([]);
            setError(null);
          }}
          className="w-full mt-2"
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UploadImageDiscuss;
