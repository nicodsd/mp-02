"use client";
import React, { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import { Button } from "@mui/material";
const imgPlaceholder = "";
import Image from "next/image";

const UserSettings: React.FC = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string>("");
  if (!image) {
    setImage(imgPlaceholder);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const imageCapture = (event: any) => {
    setImage(URL.createObjectURL(event?.target.files[0]));
    console.log("Image captured");
  };
  const delteImage = () => {
    setImage("");
    console.log("Image deleted");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Name:", name);
    console.log("Image:", image);
  };

  console.log(image);
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div>
        <label htmlFor="image">Profile Image:</label>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
        >
          Seleccionar imagen
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={imageCapture}
          />
        </Button>
        <div style={{ marginTop: 8 }}>
          <Image
            loading="eager"
            src={image}
            width={250}
            height={250}
            alt={"Vista previa"}
            className="w-min-10rem h-min-10rem object-contain rounded-md border border-gray-200"
          />
          {image && image !== imgPlaceholder && (
            <button
              type="button"
              onClick={delteImage}
              className="block w-24 h-8 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            >
              Borrar imagen
            </button>
          )}
        </div>
      </div>
      <button type="submit">Save Settings</button>
    </form>
  );
};

export default UserSettings;
