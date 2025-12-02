"use client";
import React, { useState } from "react";
import { CloudUpload, Close } from "@mui/icons-material";
import { Button } from "@mui/material";
import Image from "next/image";
import imageCompression from "browser-image-compression";
const URL = process.env.NEXT_PUBLIC_API_URL!;
const UserSettings = ({ user, token }: { user: any; token: string }) => {
  const vista = user.photo;
  const [name, setName] = useState(user.name);
  const [img, setImage] = useState<string>(user.photo);
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
    } catch (err) {
      console.error("Error al comprimir la imagen:", err);
      setError("No se pudo comprimir la imagen.");
    }
  };
  const delteImage = () => {
    fetch(`${URL}/users/${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
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
  return (
    <form onSubmit={handleSubmit}>
      <div className="relative h-fit my-5">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="relative w-[260px] h-[260px]">
          {img && img !== vista && (
            <button
              type="button"
              onClick={delteImage}
              className="absolute top-0 right-0 w-fit h-9 text-[10px] px-4 text-white bg-[#2828287b] border-gray-300 rounded cursor-pointer focus:outline-none"
            >
              <Close /> Quitar
            </button>
          )}
          <Image
            loading="eager"
            src={img}
            width={260}
            height={260}
            alt="Vista previa"
            className="object-cover rounded-md max-h-[260px] max-w-[260px]"
          />
        </div>
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
          Cambiar imagen
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
      </div>
      <div>
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div></div>
      <button className="px-4 py-1.5 text-md font-bold text-white cursor-pointer bg-lime-500 rounded-md hover:bg-lime-600 transition" type="submit">Guardar cambios</button>
      <button
        onClick={() => { }}
        className="px-4 py-1.5 text-md font-bold text-white cursor-pointer bg-red-500 rounded-md hover:bg-red-600 transition" type="submit">Cancelar</button>
    </form>
  );
};

export default UserSettings;
