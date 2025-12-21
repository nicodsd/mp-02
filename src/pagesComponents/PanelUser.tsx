"use client";
import { Tab, TabPanel, TabPanels, TabGroup, TabList } from "@headlessui/react";
import { useRouter } from "next/navigation";
import UserSettings from "@/src/components/dashboard/UserSettings";
import MenuItems from "@/src/components/dashboard/MenuItems";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default function PanelUser({ user, token, foods }: { user: any; token: string; foods: any[] }) {
    const router = useRouter();
    const handleLogout = () => {
        fetch(`${apiUrl}api/auth/signout`, { method: "POST", credentials: "include" })
            .then((res) => res.ok && router.push("/"))
            .catch((err) => console.error("Error", err));
    };
    return (
        <div className="min-h-[calc(100vh-56px)] font-sans text-gray-900 px-[3vw] py-[2vh]">
            <div className="relative flex flex-col px-[3.4vw] md:px-[2vw]">

                {/* Header Fijo */}
                <header className="md:py-2 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold tracking-tight">Panel de Usuario</h2>
                </header>
                <div className="flex md:flex-row flex-col items-center w-full">
                    <TabGroup className="md:flex md:gap-x-2 w-full">
                        {/* Navegación de Pestañas Estilo Pastilla */}
                        <div className="mt-1 h-fit bg-white md:px-4 md:py-5 rounded-2xl">
                            <TabList className="flex border-b border-gray-300 pb-5 md:flex-col space-x-1 md:space-x-0 md:space-y-2 w-full md:h-fit">
                                <Tab className={({ selected }) =>
                                    `w-full md:px-20 rounded-xl cursor-pointer py-2.5 text-sm font-bold leading-5 transition-all
                                ${selected ? "bg-white text-gray-900 border outline outline-[#2bee79]" : "text-gray-500 border border-gray-200 hover:text-gray-700"}`
                                }>Usuario</Tab>
                                <Tab className={({ selected }) =>
                                    `w-full md:px-20 rounded-xl cursor-pointer py-2.5 text-sm font-bold leading-5 transition-all
                                ${selected ? "bg-white text-gray-900 border outline outline-[#2bee79]" : "text-gray-500 border border-gray-200 hover:text-gray-700"}`
                                }>Menú</Tab>
                            </TabList>
                            <button onClick={handleLogout} className="text-red-500 border border-red-800/20 hover:bg-red-100 p-2 mt-8 bg-red-50 cursor-pointer w-full hidden md:block rounded-xl transition">
                                <span className="font-bold">Cerrar Sesión</span>
                            </button>
                        </div>

                        <TabPanels className="flex w-full mt-4 md:mt-0 bg-white rounded-2xl p-6 shadow-sm">
                            <TabPanel>
                                <UserSettings user={user} token={token} />
                            </TabPanel>
                            <TabPanel>
                                <MenuItems dataFoods={foods} />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                    <button onClick={handleLogout} className="text-red-500 border border-red-800/20 hover:bg-red-100 p-2 mt-10 bg-red-50 cursor-pointer w-60 block md:hidden rounded-xl transition">
                        <span className="font-bold">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
}