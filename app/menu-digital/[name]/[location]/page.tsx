"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGetSatellite } from "@/app/api/menu/userGetSatellite";
import Bell from "@/src/components/buttons/Bell";
import templates from "@/src/data/templates.json";
import PromosModal from "@/src/components/modals/PromosModal";
import MenuCookieConsentModal from "@/src/components/modals/MenuCookieConsentModal";
import PausedMenuNotice from "@/src/components/modals/PausedMenuNotice";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; location: string }>;
}) {
  const { name, location } = await params;
  const user = await userGetSatellite(name, location);
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
  const activePromos = (user?.data?.foods || [])
    .filter((f: any) => f.is_promo && f.is_archived !== true)
    .map((f: any) => ({
      _id: f._id,
      name: f.name,
      price: f.price,
      promo_price: f.promo_price,
      photo: f.photo,
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
        ${user?.data?.navBar === "recortado"
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
      {user?.data?.plan === 'free' && <Footer template={template} />}
    </div>
  );
}
