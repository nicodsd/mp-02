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
        <div className="min-h-[calc(100vh-56px)] flex flex-col justify-between text-gray-900">
            <div className="px-[2vw] py-[2vh]">
                <div className="relative flex flex-col md:px-[3vw]">

                    <div className="flex md:flex-row flex-col items-center w-full">
                        <TabGroup className="md:flex md:gap-x-2 w-full justify-center">

                            <TabList className="flex w-full md:flex-col space-x-1 md:space-x-0 md:space-y-2 md:w-[20vw] md:h-fit">
                                <Tab className={({ selected }) =>
                                    `w-full lg:px-20 rounded-xl cursor-pointer py-2.5 text-sm font-bold leading-5 transition-all
                                ${selected ? "bg-white text-gray-900 border border-transparent outline outline-[#ff6600]" : "text-gray-500 border border-gray-200 hover:text-gray-700"}`
                                }>Usuario</Tab>
                                <Tab className={({ selected }) =>
                                    `w-full lg:px-20 rounded-xl cursor-pointer py-2.5 text-sm font-bold leading-5 transition-all
                                ${selected ? "bg-white text-gray-900 border border-transparent outline outline-[#ff6600]" : "text-gray-500 border border-gray-200 hover:text-gray-700"}`
                                }>Menú</Tab>



                            </TabList>

                            <TabPanels className="flex w-full justify-center mt-4 md:mt-0 bg-white h-fit border border-gray-200 rounded-2xl md:px-3 py-10">
                                <TabPanel className="w-full md:min-h-[calc(100vh-200px)] md:w-[60%]">
                                    <UserSettings user={user} token={token} apiUrl={apiUrl} />
                                </TabPanel>
                                <TabPanel className="w-full h-fit md:min-h-[calc(100vh-200px)]">
                                    <MenuItems dataFoods={foods} />
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>

                    </div>
                </div>
            </div>
            <div className="md:hidden flex justify-center w-full h-fit py-10 border-t border-gray-200">
                <button onClick={handleLogout} className="text-red-500 border border-red-800/20 w-50 hover:bg-red-100 p-2 bg-red-50 cursor-pointer block rounded-xl transition">
                    <span className="font-bold">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}