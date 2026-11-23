"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGet } from "@/app/api/menu/userGet";
import Bell from "@/src/components/buttons/Bell";
import templates from "@/src/data/templates.json";
import getMenus from "@/src/lib/getMenus";
import BranchesModal from "@/src/components/modals/BranchesModal";
import PromosModal from "@/src/components/modals/PromosModal";
import MenuCookieConsentModal from "@/src/components/modals/MenuCookieConsentModal";
import PausedMenuNotice from "@/src/components/modals/PausedMenuNotice";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const user = await userGet(name);
  let template = templates.find((t) => t.template_id === user?.data?.template_id);
  if (user?.data.plan !== "free") {
    template = templates.find((t) => t.template_id === user?.data?.template_id);
  } else {
    template = templates.find((t) => t.template_id === "default");
    user.data.presentation = "list"
    user.data.navBar = "default"
  }
  if (!user?.data) {
    return <PageNotFound />;
  }

  const isPremium = String(user?.data?.plan || "").toLowerCase() === "premium";
  const userId = user.data.user_id || user.data._id || user.data.id;
  const menusData = isPremium && userId ? await getMenus(userId) : { menus: [] };
  const menus = isPremium ? (menusData?.menus || []) : [];
  const activePromos = (user?.data?.foods || [])
    .filter((f: any) => f.is_promo && f.is_archived !== true)
    .map((f: any) => ({
      _id: f._id,
      name: f.name,
      price: f.price,
      promo_price: f.promo_price,
      photo: f.photo,
      description: f.description
    }));

  const isPaused =
    user?.data?.paused === true ||
    user?.data?.paused === 1 ||
    user?.data?.paused === "true";
  const menuData = isPaused ? { ...user.data, whatsAppCart: false } : user.data;

  return (
    <div className="flex relative flex-col min-h-screen">
      {isPaused && (
        <PausedMenuNotice restaurantName={user?.data?.name} template={template} />
      )}
      {!isPaused && user?.data.plan !== "free" && activePromos.length > 0 && <PromosModal promos={activePromos} template={template} />}
      {menus.length > 0 && <BranchesModal template={template} menus={menus} userName={user.data.name} />}
      {!isPaused && user?.data?.whatsAppCart === true && (
        <MenuCookieConsentModal restaurantName={user?.data?.name} template={template} />
      )}
      <NavBar
        state={0}
        bttn={false}
        cookie={undefined}
        template={template}
        photo={user?.data?.photo}
        user={user?.data}
      />
      <div className={`
        ${user?.data?.plan !== "free" && user?.data?.navBar === "recortado"
          ?
          `absolute top-36 w-full rounded-t-full h-54 z-0 inset-0 ${template?.backgroundColor} transition-colors duration-300`
          :
          "hidden"
        }`
      } />
      {!isPaused && user?.data?.whatsAppCart === true &&
        <Bell user={user?.data} template={template} />
      }
      <Menu example={false} data={menuData} template={template} />
      {user?.data?.plan === "free" && <Footer template={template} />}
    </div>
  );
}