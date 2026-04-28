"use client";
import { useState, Fragment } from "react";
import Image from "next/image";
import { logotipo } from "@/src/lib/const";
import { URI } from "@/src/lib/const";
import { logout } from "@/app/actions"
import BttnBack from "@/src/components/buttons/BttnBack";
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
import UserPlan from "@/src/components/user-plan/UserPlan";

export default function PanelUser({
  user,
  token,
  foods,
  template,
}: {
  user: any;
  token: string;
  foods: any[];
  template: any;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${URI}/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (res.status === 200) {
        const result = await logout();

        if (result.success) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error en logout:", err);
    }
  };

  const tabClass = (selected: boolean) =>
    `w-full flex items-center gap-3 rounded-lg cursor-pointer py-3.5 px-5 text-sm font-bold transition-all outline-none
    ${selected
      ? "text-white bg-black transform scale-[1.02]"
      : "text-gray-500 hover:bg-gray-100 bg-transparent"
    }`;

  const menuItems = [
    { name: "Usuario", icon: <HiOutlineUser size={20} /> },
    { name: "Platos", icon: <HiOutlineClipboardList size={20} /> },
    { name: "Personalización", icon: <HiOutlineColorSwatch size={20} /> },
    { name: "Promociones", icon: <HiOutlineTicket size={20} /> },
  ];

  if (user?.plan === "free") {
    menuItems.pop();
    menuItems.pop();
  }

  return (
    <div className="h-screen relative">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-3 right-3 z-40 bg-background ring-7 ring-background text-gray-800 border-gray-800 border p-4 rounded-full active:scale-90 transition-all"
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
                  <div className="flex items-start justify-between px-6 py-8">
                    <div className="flex flex-col">
                      <BttnBack />
                      <div className="flex ml-2 flex-col gap-2 mt-10">
                        <div className="flex items-center gap-2">
                          <Image
                            src={logotipo}
                            alt="Logo"
                            width={70}
                            height={40}
                            priority
                          />
                          <span className="text-xs text-gray-500">/ Panel de usuario</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg text-gray-800 uppercase">
                            {user?.name}
                          </h3>
                          <UserPlan plan={user?.plan} />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-gray-400"
                    >
                      <HiX size={24} />
                    </button>
                  </div>

                  <nav className="mt-10 px-4 space-y-2 flex flex-col justify-between h-full">
                    <div>
                      {menuItems?.map((item, index) => (
                        <button
                          key={item?.name}
                          onClick={() => {
                            setSelectedIndex(index);
                            setIsSidebarOpen(false);
                          }}
                          className={tabClass(selectedIndex === index)}
                        >
                          {item?.icon} {item?.name}
                        </button>
                      ))}
                    </div>
                    <div className="w-full pl-5">
                      <button
                        onClick={() => { handleLogout() }}
                        className="mt-30 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors md:hidden font-bold cursor-pointer"
                      >
                        <HiOutlineLogout size={20} /> Cerrar Sesión
                      </button>
                    </div>
                  </nav>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        <div className="w-full h-screen md:mx-auto sm:px-4 lg:px-8 py-2">
          <div className="flex h-full w-full md:justify-between items-start flex-col md:flex-row gap-4 md:gap-8">
            <aside className="hidden h-full md:block md:w-80 shrink-0">
              <div className="sticky top-10">
                <BttnBack />
                <div className="flex ml-2 flex-col gap-2 mt-8">
                  <div className="flex items-center gap-2">
                    <Image
                      src={logotipo}
                      alt="Logo"
                      width={70}
                      height={40}
                      priority
                    />
                    <span className="text-xs text-gray-500">/ Panel de usuario</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg text-gray-800 uppercase">
                      {user?.name}
                    </h3>
                    <UserPlan plan={user?.plan} />
                  </div>
                </div>
                <TabList className="flex flex-col mt-16 gap-y-2">
                  {menuItems?.map((item, index) => (
                    <Tab
                      key={item?.name}
                      className={({ selected }) => tabClass(selected)}
                    >
                      {item?.icon} {item?.name}
                    </Tab>
                  ))}
                </TabList>
                <div className="w-full pl-5">
                  <button
                    onClick={() => { handleLogout() }}
                    className="mt-30 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors font-bold cursor-pointer"
                  >
                    <HiOutlineLogout size={20} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 w-full">
              <TabPanels className="min-h-full w-full lg:w-[70%] overflow-hidden">
                <div className="md:hidden py-1 px-2 md:px-0">
                  <BttnBack />
                </div>
                <div className="pb-13 pt-8 md:pt-6 w-full max-w-full">
                  <TabPanel className="focus:outline-none w-full">
                    <UserSettings user={user} logout={handleLogout} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none w-full">
                    <MenuItems dataFoods={foods} template={template} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none w-full">
                    <ConfigureMenu user={user} />
                  </TabPanel>
                  <TabPanel className="focus:outline-none w-full">
                    <PromoPanel />
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
