"use server";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import Menu from "@/src/pagesComponents/Menu";
import PageNotFound from "@/app/not-found";
import { userGet } from "@/app/api/menu/userGet";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const user = await userGet(name);
  if (!user?.data) {
    return <PageNotFound name={name} />;
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
      <Menu data={user?.data} />
      <Footer />
    </>
  );
}
