"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTimes,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import { TbNotes } from "react-icons/tb";
import { EditableFieldKey } from "./types";

interface FieldEditModalProps {
  activeField: EditableFieldKey | null;
  user: any;
  loading: boolean;
  values: Record<EditableFieldKey, string>;
  onClose: () => void;
  onChangeField: (field: EditableFieldKey, value: string) => void;
  onClearDraftField: (field: EditableFieldKey) => void;
  onRemoveField: (field: EditableFieldKey) => void;
}

const FIELD_METADATA: Record<
  EditableFieldKey,
  {
    titleName: string;
    label?: React.ReactNode;
    maxLength: number;
    placeholder?: string;
    sanitize?: (val: string) => string;
  }
> = {
  name: {
    titleName: "Nombre",
    maxLength: 25,
    sanitize: (val) => val.replace(/[^a-zA-Z0-9\s-_]/g, ""),
  },
  description: {
    titleName: "Descripción",
    label: (
      <>
        <TbNotes size={20} />
        Descripción
      </>
    ),
    maxLength: 40,
  },
  schedule: {
    titleName: "Horario de Atención",
    label: (
      <>
        <FaClock size={20} /> Horarios de Atención
      </>
    ),
    maxLength: 30,
  },
  location: {
    titleName: "Ubicación",
    label: (
      <>
        <FaMapMarkerAlt size={20} /> Ubicación
      </>
    ),
    maxLength: 40,
  },
  phone: {
    titleName: "WhatsApp",
    label: (
      <>
        <FaWhatsapp size={20} /> WhatsApp
      </>
    ),
    maxLength: 10,
  },
  instagram: {
    titleName: "Instagram",
    label: (
      <>
        <FaInstagram size={20} /> www.instagram.com/
      </>
    ),
    maxLength: 25,
    placeholder: "Nombre de Usuario",
  },
  facebook: {
    titleName: "Facebook",
    label: (
      <>
        <FaFacebook size={20} /> Facebook
      </>
    ),
    maxLength: 25,
    placeholder: "Nombre de Usuario",
  },
  tiktok: {
    titleName: "TikTok",
    label: (
      <>
        <FaTiktok /> TikTok
      </>
    ),
    maxLength: 25,
  },
};

const FieldEditModal: React.FC<FieldEditModalProps> = ({
  activeField,
  user,
  loading,
  values,
  onClose,
  onChangeField,
  onClearDraftField,
  onRemoveField,
}) => {
  if (!activeField) return null;

  const meta = FIELD_METADATA[activeField];
  const hasSavedValue = Boolean(user?.[activeField]);
  const currentValue = values[activeField] ?? "";

  return (
    <div className="fixed inset-0 z-50 bg-background w-full h-full flex flex-col p-4 overflow-y-auto">
      <div className="flex flex-col gap-3 mb-2 w-full md:max-w-xl mx-auto">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer w-fit"
        >
          <ChevronLeft size={20} /> Volver
        </button>
        <h2 className="text-xl font-bold mt-6 text-gray-800">
          {!hasSavedValue
            ? `Agregar ${meta.titleName}`
            : `Editar ${meta.titleName}`}
        </h2>
      </div>

      <div className="w-full md:max-w-xl mx-auto flex flex-col gap-4 flex-1">
        <div className="relative">
          {meta.label && (
            <label className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1">
              {meta.label}
            </label>
          )}
          <div className={`relative ${meta.label ? "mt-2" : ""}`}>
            <input
              className="w-full border p-3 rounded-lg"
              maxLength={meta.maxLength}
              placeholder={meta.placeholder}
              value={currentValue}
              onChange={(e) => {
                const rawVal = e.target.value;
                const nextVal = meta.sanitize ? meta.sanitize(rawVal) : rawVal;
                onChangeField(activeField, nextVal);
              }}
              autoFocus
            />
            {activeField !== "name" && hasSavedValue ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => onRemoveField(activeField)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Quitar"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onClearDraftField(activeField)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldEditModal;
