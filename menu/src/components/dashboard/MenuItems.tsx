"use client";
import React, { useState, useEffect } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { CloudUpload, DeleteOutline, PhotoCamera } from "@mui/icons-material";
import imageCompression from "browser-image-compression";
import imgPlaceholder from "../../../public/images/image_placeholder.png";
import Image from "next/image";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";

type MenuItem = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
};

export function MenuItems({ dataFoods }: { dataFoods: MenuItem[] }) {
  //function para formatear precio
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const [img, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [off, setOff] = useState<boolean>(false);

  // Liberar URL temporal al desmontar o cambiar imagen
  useEffect(() => {
    return () => {
      if (img && img !== imgPlaceholder.src) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  // Estados para manejar el formulario de añadir/editar platos
  const [items, setItems] = useState<MenuItem[]>(dataFoods ?? []); // Estado de lista de platos
  const [isEditing, setIsEditing] = useState(false); //BOOL
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    // Estado del plato actual (nuevo o a editar)
    _id: "",
    name: "",
    photo: "",
    description: "",
    price: 0,
    category: "",
  });

  // Manejo de cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing item
      setItems((prev) =>
        prev.map((item) => (item._id === currentItem._id ? currentItem : item))
      );
      setIsEditing(false);
    } else {
      // Add new item
      setItems((prev) => [
        ...prev,
        { ...currentItem, _id: Date.now().toString() },
      ]);
    }
    // Reset form
    setImage(imgPlaceholder.src);
    setCurrentItem({
      _id: "",
      name: "",
      photo: imgPlaceholder.src,
      description: "",
      price: 0,
      category: "",
    });
  };

  // Manejo de la carga y compresión de imágenes
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

      const compressedFile = await imageCompression(selectedFile, options); // Comprime la imagen, pasamos la imagen y la options
      const imageUrl = URL.createObjectURL(compressedFile);

      setImage(imageUrl);
      setCurrentItem((prev) => ({ ...prev, photo: imageUrl }));
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

  // Datos del formulario

  const delteImage = () => {
    if (img && img !== imgPlaceholder.src) {
      URL.revokeObjectURL(img); // libera la URL temporal
    }
    setOff(false);
    setImage(imgPlaceholder.src);
    console.log("Imagen eliminada");
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setImage(item.photo || imgPlaceholder.src);
    setIsEditing(true);
  };

  const handleDelete = (id: string | number) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const postFood = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    // Aquí iría la lógica para guardar el plato
    /*     const formData = new FormData();
    formData.append("image", file); // file es el comprimido
    
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }); */
  };

  return (
    <Box sx={{ pt: 0 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="name"
              label="Nombre del plato"
              value={currentItem.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="category"
              label="Categoría"
              value={currentItem.category}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="price"
              label="Precio"
              type="number"
              value={currentItem.price}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid size={12}>
            <div className="relative h-fit my-5">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Image
                src={currentItem.photo || imgPlaceholder.src}
                width={260}
                height={260}
                alt={currentItem.name || "Vista previa"}
                className="object-cover rounded-md max-h-[260px] max-w-[260px]"
              />
              {img && img !== imgPlaceholder.src && (
                <button
                  type="button"
                  onClick={delteImage}
                  className="absolute top-0 right-0 w-fit h-9 text-[10px] px-4 text-white bg-[#ff0000] border-gray-300 rounded cursor-pointer focus:outline-none"
                >
                  <DeleteOutline /> Borrar
                </button>
              )}
            </div>
          </Grid>
          <Button
            sx={{
              bgcolor: "black",
              borderRadius: "5px",
              paddingX: "12px",
              paddingY: "6px",
              fontSize: "10px",
            }}
            disabled={off}
            component="label"
            variant="contained"
            startIcon={<PhotoCamera />}
          >
            Subir Imagen
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) imageCapture(file);
              }}
            />
          </Button>
          <Button
            sx={{
              bgcolor: "blue",
              borderRadius: "5px",
              paddingX: "12px",
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
          <Grid size={12}>
            <TextField
              fullWidth
              name="description"
              label="Descripción"
              multiline
              rows={2}
              value={currentItem.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? "Actualizar Plato" : "Añadir Plato"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 className="text-xl font-extrabold ">{item.name}</h3>
                  <Box>
                    <IconButton onClick={() => handleEdit(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <p>{item.description}</p>
                <p>Categoría: {item.category}</p>
                <span className="text-md font-bold">
                  Precio: {formatearPrecio(item.price)}
                </span>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MenuItems;
