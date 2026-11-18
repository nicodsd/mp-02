"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Coffee, Lock } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { URI } from "@/src/lib/const";
import { updateUserCookie, updateMenuCookie } from "@/app/actions";

interface PauseMenuSectionProps {
  user: any;
  updateUserLocal: (updates: Record<string, any>) => void;
  refreshPanelData: () => Promise<void>;
}

const PauseMenuSection: React.FC<PauseMenuSectionProps> = ({
  user,
  updateUserLocal,
  refreshPanelData,
}) => {
  const isPaused =
    user?.paused === true || user?.paused === 1 || user?.paused === "true";
  const [pauseLoading, setPauseLoading] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  const togglePause = async () => {
    const nextPaused = !isPaused;
    setPauseLoading(true);

    const formData = new FormData();
    formData.append("paused", String(nextPaused));
    formData.append("user_id", String(user?.id));

    try {
      const res = await fetch(`${URI}/menu/update/info/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          alert(`Error de validación: ${data.errors.join(", ")}`);
        } else {
          alert(data.message || "Ocurrió un error inesperado");
        }
        return;
      }
      if (data.success) {
        if (data.user) await updateUserCookie(data.user);
        if (data.menu) await updateMenuCookie(data.menu);
        updateUserLocal({
          ...(typeof data.user === "object" ? data.user : {}),
          ...(typeof data.menu === "object" ? data.menu : {}),
          paused: nextPaused,
        });
        await refreshPanelData();
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setPauseLoading(false);
      setShowPauseConfirm(false);
    }
  };

  return (
    <>
      {/* Modo descanso */}
      {user?.plan !== "free" ? (
        <div
          className={`w-full mt-4 md:mt-0 p-4 md:p-6 rounded-3xl border flex items-center justify-between gap-4 transition-colors ${isPaused ? "bg-amber-50 border-amber-300" : "border-gray-200 bg-white"
            }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors ${isPaused ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-700"
                }`}
            >
              <Coffee size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                Modo descanso{" "}
                {isPaused && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                )}
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                {isPaused
                  ? "Tu menú está pausado. Tus clientes verán que el local está en descanso."
                  : "Pausa tu menú temporalmente (vacaciones, cierre, etc)."}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isPaused}
            aria-label="Modo descanso"
            disabled={pauseLoading}
            onClick={() => (isPaused ? togglePause() : setShowPauseConfirm(true))}
            className={`${isPaused ? "bg-amber-500" : "bg-gray-300"
              } cursor-pointer relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-wait`}
          >
            <span
              className={`${isPaused ? "translate-x-6" : "translate-x-1"
                } inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200`}
            >
              {pauseLoading && (
                <FaSpinner className="animate-spin text-gray-500" size={10} />
              )}
            </span>
          </button>
        </div>
      ) : (
        <Link
          href="/panel-de-usuario?seccion=plan"
          className="w-full mb-6 p-4 md:p-6 rounded-3xl border-2 border-gray-300 bg-gray-100/70 flex items-center justify-between gap-4 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
              <Coffee size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-700">Modo descanso</span>
              <span className="text-xs md:text-sm text-gray-500">
                Mejora tu plan para poder pausar tu menú.
              </span>
            </div>
          </div>
          <Lock size={20} className="text-gray-400 shrink-0" />
        </Link>
      )}

      {showPauseConfirm && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
          onClick={() => !pauseLoading && setShowPauseConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Coffee size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              ¿Pausar tu menú?
            </h3>
            <p className="text-sm text-gray-500">
              Mientras el modo descanso esté activo, tus clientes no podrán
              hacer pedidos y verán que el local está en descanso. Puedes
              reactivarlo cuando quieras.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                disabled={pauseLoading}
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 px-4 py-3 border rounded-xl cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pauseLoading}
                onClick={togglePause}
                className="flex-1 px-4 py-3 bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                {pauseLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Pausar menú"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PauseMenuSection;
