"use client";
import React, { useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
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
  function formatearPrecio(precio: number | string) {
    const value = typeof precio === "string" ? Number(precio) : precio;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(dataFoods ?? []);
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    _id: "",
    name: "",
    photo: "",
    description: "",
    price: 0,
    category: "",
  });

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
    setCurrentItem({
      _id: "",
      name: "",
      photo: "",
      description: "",
      price: 0,
      category: "",
    });
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = (id: string | number) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
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
