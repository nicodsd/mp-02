export default function LoadingCategories() {
    return (
        <div className="space-y-4">
            {/* Lista de categorías */}
            <div className="flex flex-wrap gap-y-1 gap-x-px">
                {/* Ejemplo de item */}
                <label
                    className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
          bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200`}
                >
                    <input type="checkbox" className="hidden" />
                    Categoría
                    <button>
                        {/* Ícono de cierre */}
                        <span className="ml-1">✕</span>
                    </button>
                </label>
            </div>

            {/* Bloque para nuevas categorías */}
            <div className="flex flex-col gap-y-3 bg-gray-100 min-h-[170px] justify-between rounded-xl px-5 py-5">
                <h3 className="font-semibold text-gray-500">Agrega nuevas categorías</h3>

                {/* Lista de nuevas categorías */}
                <div className="flex flex-wrap gap-y-1 h-full gap-x-px w-full">
                    <label
                        className={`cursor-pointer px-4 py-1.5 rounded-full border text-sm font-semibold transition
            bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200`}
                    >
                        <input type="checkbox" className="hidden" />
                        Nueva categoría
                        <button>
                            <span className="ml-1">✕</span>
                        </button>
                    </label>
                </div>

                {/* Input para agregar nueva categoría */}
                <div className="flex w-full justify-center">
                    <div className="flex gap-2 w-full items-center">
                        <input
                            type="text"
                            placeholder="Nueva categoría"
                            className="px-3 py-2 border w-full border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

};