import { cookies } from "next/headers";
import { TabPanel } from "@headlessui/react";
import MenuSettings from "@/src/components/dashboard/UserSettings";
import PanelUser from "@/src/pagesComponents/PanelUser";
import templates from "@/src/data/templates.json";
import ConfigureMenu from "@/src/components/dashboard/ConfigureMenu";
import MenuItems from "@/src/components/dashboard/MenuItems";
import Sucursales from "@/src/components/dashboard/StoreAdd";
import PromoPanel from "@/src/components/dashboard/PromoPanel";
import TemplateSelector from "@/src/components/dashboard/Templates";
import SubscriptionPanel from "@/src/components/dashboard/SubscriptionPanel";

export const metadata = {
  title: "Panel de Usuario | QMenú",
  description: "Administra tu cuenta y tus menús digitales desde el panel de control.",
};

// Helper seguro para parsear JSON de cookies
function safeJsonParse<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const rawUser = cookieStore.get("user")?.value;
  const rawMenu = cookieStore.get("menu")?.value;
  const parsedUser = safeJsonParse<Record<string, any>>(rawUser);
  const parsedMenu = safeJsonParse<Record<string, any>>(rawMenu);

  // Si no hay token o usuario válido, enviamos valores vacíos/nulos
  if (!token || !parsedUser) {
    return (
      <PanelUser user={null} token="" template={null}>
        <div className="p-4 text-center">No has iniciado sesión o la sesión ha expirado.</div>
      </PanelUser>
    );
  }
  // Fusionar datos del usuario con los del menú activo si existe
  const user = { ...parsedUser, ...parsedMenu };
  const template = templates.find((t) => t.template_id === user?.template_id) || null;

  return (
    <PanelUser user={user} token={token} template={template}>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <MenuSettings user={user} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <MenuItems dataFoods={[]} template={template} user={user} token={token} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <PromoPanel foods={[]} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <ConfigureMenu user={user} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <TemplateSelector user={user} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <Sucursales menus={[]} user_id={user.id} user={user} />
      </TabPanel>
      <TabPanel unmount={false} className="focus:outline-none w-full data-closed:hidden">
        <SubscriptionPanel user={user} />
      </TabPanel>
    </PanelUser>
  );
}