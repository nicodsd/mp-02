"use client";
export default function InputsUserSettings({ setName, setDescription, setLocation, setPhone }: { setName: (name: string) => void; setDescription: (description: string) => void; setLocation: (location: string) => void; setPhone: (phone: string) => void }) {
    return (
        <div className="w-full space-y-4">
            <label className="text-gray-600 dark:text-gray-800">Nombre</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
            />
            <label className="text-gray-600 dark:text-gray-800">Descripción</label>
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
            />
            <label className="text-gray-600 dark:text-gray-800">Ubicacion</label>
            <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
            />
            <label className="text-gray-600 dark:text-gray-800">Telefono</label>
            <input
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-gray-300 mt-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow shadow-sm"
            />
        </div>
    );
}