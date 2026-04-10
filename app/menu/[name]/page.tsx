"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGet } from "@/app/api/menu/userGet";
import Bell from "@/src/components/buttons/Bell";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const user = await userGet(name);
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
      />
      <Bell />
      <Menu data={user?.data} />
      <Footer />
    </>
  );
}
