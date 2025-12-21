"use client";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import plus from "@/public/images/icons-index/PLUS.svg"
import Image from "next/image";
import { FaEdit, FaSearch } from 'react-icons/fa';

export function MenuItems({ dataFoods }: { dataFoods: any[] }) {
  const [items, setItems] = useState(dataFoods ?? []);

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs - Estadísticas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-start p-4 rounded-xl bg-orange-100 border border-orange-300">
          <span className=" text-orange-400 mb-1">Platos</span>
          <span className="text-2xl font-bold text-orange-700">{items.length}</span>
          <span className="text-xs font-medium text-gray-600">Platos Activos</span>
        </div>
        {/* <div className="flex flex-col items-start p-4 rounded-xl bg-[#E0F7FA] border border-teal-100/70">
          <span className=" text-[#00796B] mb-1">Visitas</span>
          <span className="text-2xl font-bold text-[#00796B]">1.2k</span>
          <span className="text-xs font-medium text-gray-600">Vistas</span>
        </div> */}
      </div>

      {/* Buscador */}
      <div className="relative">
        <input
          className="w-full bg-gray-100 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#2bee79]"
          placeholder="Buscar plato..."
        />
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Lista de Platos */}
      <div className="space-y-3">
        {items.map((food) => (
          <div key={food._id} className="group flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#2bee79]/50 transition-all">
            <div
              className="w-16 h-16 shrink-0 rounded-lg bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${food.photo})` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm truncate">{food.name}</h3>
                <span className="text-[#2bee79] font-bold text-sm">${food.price}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{food.description}</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-[#2bee79] transition-colors">
              <span className=" text-sm"><FaEdit /></span>
            </button>
          </div>
        ))}
      </div>

      {/* Botón Flotante (Portal o Relativo) */}
      <div className="fixed bottom-10 right-10 md:right-[calc(50%-180px)]">
        <button className="h-14 w-14 rounded-full bg-[#2bee79] text-[#102217] shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
          <span className=""><Image src={plus} alt="icono de agregar" className="text-green-700" width={30} height={30} /></span>
        </button>
      </div>
    </div>
  );
}
export default MenuItems;