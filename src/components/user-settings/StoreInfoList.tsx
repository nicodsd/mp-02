"use client";
import React from "react";
import { Store } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { EditableFieldKey } from "./types";

interface StoreInfoListProps {
  user: any;
  name: string;
  description: string;
  schedule: string;
  location: string;
  phone: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  onEditField: (field: EditableFieldKey) => void;
}

interface InfoRowConfig {
  field: EditableFieldKey;
  label: string;
  icon: React.ReactNode;
  displayValue: string;
  hasSavedValue: boolean;
  clamp?: boolean;
  alwaysEditable?: boolean;
}

const StoreInfoList: React.FC<StoreInfoListProps> = ({
  user,
  name,
  description,
  schedule,
  location,
  phone,
  instagram,
  facebook,
  tiktok,
  onEditField,
}) => {
  const prefix = phone.slice(0, 3);
  const number = phone.slice(3);

  const rows: InfoRowConfig[] = [
    {
      field: "name",
      label: "Nombre",
      icon: <Store size={20} className="text-gray-800" />,
      displayValue: name,
      hasSavedValue: true,
      alwaysEditable: true,
    },
    {
      field: "description",
      label: "Descripción",
      icon: <TbNotes size={20} className="text-gray-800" />,
      displayValue: description,
      hasSavedValue: Boolean(user?.description),
      clamp: true,
    },
    {
      field: "schedule",
      label: "Horarios de Atención",
      icon: <FaClock size={20} className="text-gray-800" />,
      displayValue: schedule,
      hasSavedValue: Boolean(user?.schedule),
      clamp: true,
    },
    {
      field: "location",
      label: "Ubicación",
      icon: <FaMapMarkerAlt size={20} className="text-gray-800" />,
      displayValue: location,
      hasSavedValue: Boolean(user?.location),
    },
    {
      field: "phone",
      label: "Whatsapp",
      icon: <FaWhatsapp size={20} className="text-gray-800" />,
      displayValue: phone ? `${prefix} ${number}` : "",
      hasSavedValue: Boolean(user?.phone),
    },
    {
      field: "instagram",
      label: "Instagram / Nombre de Usuario",
      icon: <FaInstagram size={20} className="text-gray-800" />,
      displayValue: instagram,
      hasSavedValue: Boolean(user?.instagram),
    },
    {
      field: "facebook",
      label: "Facebook / Nombre de Usuario",
      icon: <FaFacebook size={20} className="text-gray-800" />,
      displayValue: facebook,
      hasSavedValue: Boolean(user?.facebook),
    },
    {
      field: "tiktok",
      label: "TikTok",
      icon: <FaTiktok size={20} className="text-gray-800" />,
      displayValue: tiktok,
      hasSavedValue: Boolean(user?.tiktok),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-y-8 md:p-6 md:rounded-4xl md:border md:border-gray-200">
      {rows.map((row) => (
        <div key={row.field} className="w-full">
          <div className="flex justify-between items-center text-gray-500">
            <div className="flex items-center gap-4">
              {row.icon}
              <div className="flex flex-col items-start">
                <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                  {row.label}
                </label>
                {row.displayValue ? (
                  <p className={`text-lg ${row.clamp ? "line-clamp-1" : ""}`}>
                    {row.displayValue}
                  </p>
                ) : (
                  <span className="text-sm italic text-gray-400">
                    Sin registrar
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditField(row.field)}
              className={`text-xs font-bold cursor-pointer ${
                row.alwaysEditable
                  ? "active:text-gray-900 transition-all text-gray-500"
                  : !row.hasSavedValue
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              {row.alwaysEditable || row.hasSavedValue ? "Editar" : "Agregar"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreInfoList;
