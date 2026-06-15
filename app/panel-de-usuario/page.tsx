import MenuSettings from "@/src/components/dashboard/UserSettings";
import PanelUser from "@/src/pagesComponents/PanelUser";
import { TabPanel } from "@headlessui/react";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import getMenus from "@/src/lib/getMenus";
import { URI } from "@/src/lib/const";
import templates from "@/src/data/templates.json";
import ConfigureMenu from "@/src/components/dashboard/ConfigureMenu";
import MenuItems from "@/src/components/dashboard/MenuItems";
import Sucursales from "@/src/components/dashboard/StoreAdd";
import PromoPanel from "@/src/components/dashboard/PromoPanel";
import TemplateSelector from "@/src/components/dashboard/Templates";
import { cookies } from "next/headers";
import BttnBack from "@/src/components/buttons/BttnBack";
import SubscriptionPanel from "@/src/components/dashboard/SubscriptionPanel";

async function PlatosPanel({ userId, token, template, user }: any) {
  const foods = await getFoodsByUser(URI, userId);
  return <MenuItems dataFoods={foods} template={template} user={user} token={token} />;
}

async function SucursalesPanel({ userId, user }: any) {
  const menus = await getMenus(userId);
  return <Sucursales menus={menus?.menus} user_id={userId} user={user} />;
}

export const metadata = {
  title: "Panel de Usuario | QMenú",
  description: "Administra tu cuenta y tus menús digitales desde el panel de control.",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const menuCookie = cookieStore.get("menu")?.value || '{}';
  let menu: any, user: any, foods, template, menus: any[] = [];
  if (token !== "{}" && userCookie !== "{}") {
    user = JSON.parse(userCookie);
    if (menuCookie) {
      menu = JSON.parse(menuCookie || "");
      user = { ...user, ...menu };
    }
    if (userCookie) {
      menus = await getMenus(user.id);
      foods = await getFoodsByUser(URI, user.id);
      template = templates.find((t) => t.template_id === user?.template_id);
    }
  }

  return (
    <PanelUser user={user} token={token} template={template}>
      <div className="md:hidden py-1 px-2 md:px-0">
        <BttnBack />
      </div>
      <div className="pb-13 pt-8 md:pt-6 w-full max-w-full">
        <TabPanel className="focus:outline-none w-full">
          <MenuSettings user={user} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <PlatosPanel userId={user?.id} token={token} template={template} user={user} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <PromoPanel foods={foods} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <ConfigureMenu user={user} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <TemplateSelector user={user} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <SucursalesPanel userId={user?.id} user={user} />
        </TabPanel>
        <TabPanel className="focus:outline-none w-full">
          <SubscriptionPanel user={user} />
        </TabPanel>
      </div>
    </PanelUser>
  );
}