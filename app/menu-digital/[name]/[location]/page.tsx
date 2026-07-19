"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGetSatellite } from "@/app/api/menu/userGetSatellite";
import Bell from "@/src/components/buttons/Bell";
import templates from "@/src/data/templates.json";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; location: string }>;
}) {
  const { name, location } = await params;
  const user = await userGetSatellite(name, location);
  const template = templates.find((t) => t.template_id === user?.data?.template_id);
  if (!user?.data) {
    return <PageNotFound />;
  }
  return (
    <div className="flex relative flex-col min-h-screen">
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
          `absolute top-34 rounded-t-full h-60 z-0 inset-0 ${template?.backgroundColor} transition-colors duration-300`
          :
          "hidden"
        }`
      } />
      {user?.data?.whatsAppCart === true &&
        <Bell user={user?.data} template={template} />
      }
      <Menu example={false} data={user?.data} template={template} />
      <Footer template={template} />
    </div>
  );
}
