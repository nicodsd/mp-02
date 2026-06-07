"use client";
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Download, FileText, Loader2, X } from "lucide-react";

export default function DownloadMenuModal({
  foods,
  restaurantName,
  template,
}: {
  foods: any[];
  restaurantName: string;
  template?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageSize, setPageSize] = useState<"A4" | "LETTER" | "LEGAL">("A4");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Importamos dinámicamente para evitar problemas de SSR con @react-pdf/renderer
      const { pdf } = await import("@react-pdf/renderer");
      const MenuPDFDocument = (await import("./MenuPDFDocument")).default;
      
      const blob = await pdf(
        <MenuPDFDocument 
          foods={foods} 
          restaurantName={restaurantName} 
          pageSize={pageSize} 
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Menu_${restaurantName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola para más detalles.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
          template?.buttonBg || "bg-orange-500 hover:bg-orange-600"
        }`}
        style={{
          backgroundColor: template?.icons || "#e28743",
        }}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Descargar PDF</span>
      </button>

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      Descargar Menú
                    </Dialog.Title>
                    <button onClick={() => setIsOpen(false)} disabled={isGenerating} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-4">
                      Selecciona el tamaño de hoja para el archivo PDF. Las imágenes y platos se distribuirán automáticamente.
                    </p>

                    <div className="flex flex-col gap-3">
                      <label className="flex flex-col text-sm font-medium text-gray-700">
                        Tamaño de hoja
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
                          value={pageSize}
                          onChange={(e) => setPageSize(e.target.value as any)}
                          disabled={isGenerating}
                        >
                          <option value="A4">A4 (Por defecto)</option>
                          <option value="LETTER">Carta (Letter)</option>
                          <option value="LEGAL">Legal / Oficio</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
                      onClick={() => setIsOpen(false)}
                      disabled={isGenerating}
                    >
                      Cancelar
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      disabled={isGenerating}
                      className={`inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none disabled:opacity-70 ${
                        template?.buttonBg || "bg-orange-500 hover:bg-orange-600"
                      }`}
                      style={{
                        backgroundColor: template?.icons || "#e28743",
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        "Descargar Ahora"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
