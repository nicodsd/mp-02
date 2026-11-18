"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

interface SaveChangesBarProps {
  isEditing: boolean;
  loading: boolean;
  onCancel: () => void;
}

const SaveChangesBar: React.FC<SaveChangesBarProps> = ({
  isEditing,
  loading,
  onCancel,
}) => {
  if (!isEditing) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="w-full flex-col md:flex-row items-center h-fit min-h-24 md:items-center justify-center md:justify-end bg-background border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 flex gap-3 px-4 md:px-7 py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"
    >
      <span className="text-gray-700 md:mr-4 text-md">
        ¿Deseas guardar los cambios?
      </span>
      <div className="flex gap-2 w-full md:w-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 border cursor-pointer rounded-xl"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full active:scale-90 transition-all disabled:opacity-50 min-w-50 md:w-auto px-6 bg-black text-white py-3 rounded-xl flex justify-center cursor-pointer items-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default SaveChangesBar;
