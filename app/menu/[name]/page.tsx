"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGet } from "@/app/api/menu/userGet";
import Bell from "@/src/components/buttons/Bell";
import templates from "@/src/data/templates.json";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const user = await userGet(name);
  const template = templates.find((t) => t.template_id === user?.data.template_id);
  if (!user?.data) {
    return <PageNotFound />;
  }
  return (
    <>
      <NavBar
        state={0}
        bttn={false}
        cookie={""}
        photo={user?.data.photo}
        user={user?.data}
        template={template}
      />
      <Bell phone={user?.data.phone} template={template} />
      <Menu data={user?.data} template={template} />
      <Footer template={template} />
    </>
  );
}
