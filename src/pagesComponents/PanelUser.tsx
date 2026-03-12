"use client";
import { useState, Fragment } from "react";
import {
  Tab,
  TabPanel,
  TabPanels,
  TabGroup,
  TabList,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineColorSwatch,
  HiOutlineTicket,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";

import UserSettings from "@/src/components/dashboard/UserSettings";
import MenuItems from "@/src/components/dashboard/MenuItems";
import ConfigureMenu from "@/src/components/dashboard/Templates";
import PromoPanel from "@/src/components/dashboard/PromoPanel";

const URI = process.env.NEXT_PUBLIC_API_URL;
export default function PanelUser({
  user,
  token,
  foods,
}: {
  user: any;
  token: string;
  foods: any[];
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleLogout = async () => {
    await fetch(`${URI}auth/signout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok && router.push("/"))
      .catch((err) => console.error("Error", err));
  };

  const tabClass = (selected: boolean) =>
    `w-full flex items-center gap-3 rounded-lg cursor-pointer py-3.5 px-5 text-sm font-bold transition-all outline-none
    ${
      selected
        ? "text-white bg-gray-900 transform scale-[1.02]"
        : "text-gray-500 hover:bg-gray-100 bg-transparent"
    }`;

  const menuItems = [
    { name: "Usuario", icon: <HiOutlineUser size={20} /> },
    { name: "Platos", icon: <HiOutlineClipboardList size={20} /> },
    { name: "Personalización", icon: <HiOutlineColorSwatch size={20} /> },
    { name: "Promociones", icon: <HiOutlineTicket size={20} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] relative">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute -top-3 right-1 z-40 bg-black text-white border-back border-7 p-4 rounded-full active:scale-90 transition-all"
        >
          <HiMenuAlt2 size={28} />
        </button>
        <Transition show={isSidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 md:hidden"
            onClose={setIsSidebarOpen}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
            >
              <div className="fixed inset-0 bg-gray-400/40 backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative flex w-full max-w-xs flex-col bg-background pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-6 py-8 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">QMENÚ</h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-gray-400"
                    >
                      <HiX size={24} />
                    </button>
                  </div>

                  <nav className="mt-6 px-4 space-y-2">
                    {menuItems.map((item, index) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setSelectedIndex(index);
                          setIsSidebarOpen(false);
                        }}
                        className={tabClass(selectedIndex === index)}
                      >
                        {item.icon} {item.name}
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="mt-10 flex items-center gap-3 w-full text-red-500 font-bold p-3 rounded-lg bg-red-50 border border-red-100"
                    >
                      <HiOutlineLogout size={20} /> Cerrar Sesión
                    </button>
                  </nav>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-72 shrink-0">
              <div className="sticky top-10">
                <TabList className="flex flex-col gap-y-2">
                  {menuItems.map((item, index) => (
                    <Tab
                      key={item.name}
                      className={({ selected }) => tabClass(selected)}
                    >
                      {item.icon} {item.name}
                    </Tab>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="mt-10 flex items-center gap-3 w-full text-red-500 border border-red-200 hover:bg-red-50 p-3.5 rounded-xl transition-colors font-bold"
                  >
                    <HiOutlineLogout size={20} /> Cerrar Sesión
                  </button>
                </TabList>
              </div>
            </aside>

            <main className="flex-1">
              <TabPanels className="border border-gray-200 rounded-xl min-h-[75vh] overflow-hidden">
                <div className="py-6 md:p-10">
                  <TabPanel className="focus:outline-none">
                    <UserSettings user={user} token={token} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <MenuItems dataFoods={foods} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <ConfigureMenu />
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <PromoPanel foods={foods} />
                  </TabPanel>
                </div>
              </TabPanels>
            </main>
          </div>
        </div>
      </TabGroup>
    </div>
  );
}
