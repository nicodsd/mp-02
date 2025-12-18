"use client";
import dynamic from "next/dynamic";
import { Tab, TabPanel, TabPanels, TabGroup, TabList } from "@headlessui/react";
import { useRouter } from "next/navigation";
import UserSettings from "@/src/components/dashboard/UserSettings";
import MenuItems from "@/src/components/dashboard/MenuItems";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
const ManageAccountsIcon = dynamic(
    () => import("@mui/icons-material/ManageAccounts"),
    { ssr: false }
);
const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"), {
    ssr: false,
});
const tabClass =
    "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";
type Food = {
    _id: string | number;
    photo: string;
    name: string;
    description: string;
    price: number | string;
    category: string;
};
export default function PanelUser({
    user,
    token,
    foods,
}: {
    user: any;
    token: string;
    foods: Food[];
}) {
    const router = useRouter();

    const handleLogout = () => {
        fetch(`${apiUrl}api/auth/signout`, {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Logout exitoso");
                    router.push("/");
                } else {
                    console.error("Error al cerrar sesión");
                }
            })
            .catch((error) => {
                console.error("Error al cerrar sesión", error);
            });
    };
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <TabGroup>
                    <TabList className="flex space-x-1 rounded-xl bg-blue-900/20">
                        <Tab
                            className={({ selected }) =>
                                `w-full flex items-center justify-center gap-2 py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg ${selected
                                    ? "bg-white shadow"
                                    : "text-blue-100 hover:bg-white/12"
                                }`
                            }
                        >
                            <ManageAccountsIcon />
                            Usuario
                        </Tab>

                        <Tab
                            className={({ selected }) =>
                                `w-full flex items-center justify-center gap-2 py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg ${selected
                                    ? "bg-white shadow"
                                    : "text-blue-100 hover:bg-white/12"
                                }`
                            }
                        >
                            <MenuIcon />
                            Menu
                        </Tab>
                    </TabList>
                    <TabPanels className="mt-2">
                        <TabPanel className={tabClass}>
                            <UserSettings user={user} token={token} />
                        </TabPanel>
                        <TabPanel className={tabClass}>
                            <MenuItems dataFoods={foods} />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
            <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-lg font-bold cursor-pointer text-red-500 hover:text-red-600 transition"
            >
                Cerrar sesión
            </button>
        </div>
    );
}