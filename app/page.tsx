import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { cookies } from 'next/headers';
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex"
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
//import logo from "@/public/images/logo/LOGO2.svg";
//import Image from "next/image";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function Page() {
  let foodsByUser;
  let categoriesByUser;
  let user;
  const state = 0;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    user = JSON.parse(userCookie);
    foodsByUser = await getFoodsByUser(apiUrl, user.id!);
    categoriesByUser = await getCategoriesByUser(apiUrl, user.id!);
  }
  return (
    <>
      <NavBar state={state} text={user?.name!} cookie={token!} photo={user?.photo!} user={user!} />
      {
        user ? <UserIndex
          initialCategories={categoriesByUser!}
          initialFoods={foodsByUser!}
        /> : <Index />
      }
      <Footer />
    </>
  );
}