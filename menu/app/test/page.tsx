"use client";
import Image from "next/image";
import { useState } from "react";

const imgPlaceholder = "/images/image_placeholder.png";

export default function Test() {
  const [selectedImage, setSelectedImage] = useState<string>();
  /*  const [img, setImage] = useState<string>(imgPlaceholder);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const imageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 2;

    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`La imagen supera los ${maxSizeMB}MB.`);
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);
    setImage(imageUrl);
    setFile(selectedFile);
    setError("");

    console.log("Imagen capturada:", selectedFile.name);
  };
 */
  return (
    <div style={{ padding: "1rem" }}>
      <form>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSelectedImage( file ? URL.
              createObjectURL(file) : undefined
            );
          }}
        />
      </form>


      { selectedImage && (
        <Image
        src={selectedImage}
        alt="Vista previa"
        width={400}
        height={400}
        style={{
          marginTop: "1rem",
          border: "1px solid #ccc",
          padding: "4px",
          objectFit: "contain"
        }}
      />)}
    </div>
  );
}
