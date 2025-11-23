"use client";
import React, { useState } from "react";
import { CloudUpload, DeleteOutline } from "@mui/icons-material";
import { Button } from "@mui/material";
import Image from "next/image";
import imgPlaceholder from "../../../public/images/image_placeholder.png";
import imageCompression from "browser-image-compression";

const UserSettings: React.FC = () => {
  const vista = String(imgPlaceholder.src);

  const [name, setName] = useState("");
  const [img, setImage] = useState<string>(vista);
  const [error, setError] = useState<string>("");
  const [off, setOff] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const imageCapture = async (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(selectedFile.type)) {
      setError("Formato no permitido. Usa JPG, PNG o WEBP.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1, // tamaño máximo deseado
        maxWidthOrHeight: 1024, // redimensiona si es necesario
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      const imageUrl = URL.createObjectURL(compressedFile);

      setImage(imageUrl);
      setOff(true);
      setError("");

      /*       console.log(
         "Imagen comprimida:",
         compressedFile.name,
         compressedFile.size
       ); */
    } catch (err) {
      console.error("Error al comprimir la imagen:", err);
      setError("No se pudo comprimir la imagen.");
    }
  };
  const delteImage = () => {
    if (img !== vista) {
      URL.revokeObjectURL(img); // libera la URL temporal
    }
    setOff(false);
    setImage(vista);
    console.log("Imagen eliminada");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Name:", name);
    console.log("Image:", img);
  };

  console.log(img);
  return (
    <form onSubmit={handleSubmit}>
      <div className="relative h-fit my-5">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Image
          loading="eager"
          src={img}
          width={260}
          height={260}
          alt="Vista previa"
          className="object-cover rounded-md max-h-[260px] max-w-[260px]"
        />
        <Button
          sx={{
            bgcolor: "blue",
            borderRadius: "5px",
            paddingX: "14px",
            paddingY: "6px",
            fontSize: "10px",
          }}
          disabled={off}
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
        >
          Seleccionar de la galería
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) imageCapture(file);
            }}
          />
        </Button>
        {img && img !== vista && (
          <button
            type="button"
            onClick={delteImage}
            className="absolute top-0 right-0 w-fit h-9 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded cursor-pointer focus:outline-none"
          >
            <DeleteOutline /> Borrar
          </button>
        )}
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div></div>
      <button type="submit">Save Settings</button>
    </form>
  );
};

export default UserSettings;
