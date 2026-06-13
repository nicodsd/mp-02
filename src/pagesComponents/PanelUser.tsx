"use client";
import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import { logotipo, URI } from "@/src/lib/const";
import BttnBack from "@/src/components/buttons/BttnBack";
import {
  TabGroup,
  Tab,
  TabList,
  TabPanels,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MdStorefront } from "react-icons/md";
import {
  HiPencil,
  HiOutlineUser,
  HiOutlineColorSwatch,
  HiOutlineTicket,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
  HiOutlineAdjustments,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
} from "react-icons/hi";
import UserPlan from "@/src/components/user-plan/UserPlan";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/app/actions";

export default function PanelUser({
  user,
  token,
  template,
  children,
}: {
  user: any;
  token: string;
  template: any;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const seccion = searchParams.get("seccion");

  useEffect(() => {
    const index = menuItems.findIndex(
      item => item.key === seccion
    );

    setSelectedIndex(index >= 0 ? index : 0);
  }, [seccion]);

  const handleTabChange = (index: number) => {
    if (index === undefined || !menuItems[index]) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("seccion", menuItems[index].key);
    router.replace(`/panel-de-usuario?${params.toString()}`);
  };

  const hadleLogoutUserAction = async (userId: string) => {
    try {
      const response = await fetch(`${URI}/auth/signout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
      if (response.status === 200) {
        await logout();
      }
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      router.push("/");
      router.refresh()
    }
  }

  const tabClass = (selected: boolean) =>
    `w-full flex items-center gap-3 rounded-lg cursor-pointer py-3.5 px-5 text-sm md:text-md font-bold transition-all outline-none disabled:opacity-40 disabled:pointer-events-none
    ${selected
      ? "text-white bg-black transform scale-[1.02]"
      : "text-gray-500 hover:bg-gray-100 bg-transparent"
    }`;

  const menuItems = [
    { key: "negocio", name: "Tu local", icon: <HiPencil size={20} /> },
    { key: "platos", name: "Platos", icon: <HiOutlineClipboardList size={20} /> },
    { key: "promociones", name: "Promociones", icon: <HiOutlineTicket size={20} /> },
    { key: "configuraciones", name: "Configura tu menú", icon: <HiOutlineAdjustments size={20} /> },
    { key: "paletas", name: "Paletas de colores", icon: <HiOutlineColorSwatch size={20} /> },
    { key: "sucursales", name: "Sucursales", icon: <MdStorefront size={20} /> },
    { key: "plan", name: "Mi Plan", icon: <HiOutlineCreditCard size={20} /> },
  ];


  return (
    <div className="h-screen relative">
      <TabGroup
        manual
        selectedIndex={selectedIndex}
        onChange={handleTabChange}
      >
        <button
          aria-label="Abrir menú del panel de usuario"
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
                      aria-label="Cerrar menú de configuración"
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-gray-400"
                    >
                      <HiX size={24} />
                    </button>
                  </div>

                  <nav className="px-4 space-y-2 flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-2">
                      {menuItems?.map((item, index) => (
                        <button
                          disabled={user?.plan === "free" && (item?.name === "Promociones" || item?.name === "Configura tu menú" || item?.name === "Paletas de colores" || item?.name === "Sucursales")}
                          key={item.name}
                          onClick={() => {
                            handleTabChange(index);
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
                        onClick={() => { hadleLogoutUserAction(user.id) }}
                        className="mt-20 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors md:hidden font-bold cursor-pointer"
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

        <div className="w-full h-screen md:mx-auto sm:px-4 lg:px-8 py-2 relative">
          <div className="flex h-full w-full md:justify-between items-start flex-col md:flex-row gap-4 md:gap-8">
            <aside className="hidden h-full md:block md:w-80 shrink-0 mt-10">
              <div className="">
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
                <TabList className="h-auto md:flex flex-col mt-16 gap-y-2">
                  {menuItems.map((item, index) => (
                    <Tab
                      key={item.name}
                      disabled={
                        user?.plan === "free" &&
                        (
                          item.name === "Promociones" ||
                          item.name === "Configura tu menú" ||
                          item.name === "Paletas de colores" ||
                          item.name === "Sucursales"
                        )
                      }
                      className={({ selected }) =>
                        tabClass(selected)
                      }
                    >
                      {item.icon} {item.name}
                    </Tab>
                  ))}
                </TabList>
                <div className="w-full pl-5">
                  <button
                    onClick={() => { hadleLogoutUserAction(user.id) }}
                    className="mt-10 flex items-center active:scale-90 gap-3 text-red-500 active:text-red-900 transition-colors font-bold cursor-pointer"
                  >
                    <HiOutlineLogout size={20} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 w-full">
              <TabPanels className="min-h-full w-full lg:w-[80%] xl:w-[90%] overflow-hidden">
                {children}
              </TabPanels>
            </main>
          </div>
        </div>
      </TabGroup>
    </div>
  );
}
