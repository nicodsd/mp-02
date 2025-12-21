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
    /*   <>
        <div className="relative h-screen w-screen overflow-hidden bg-[#ff1c1c] flex flex-col items-center justify-center text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-yellow-500/70 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-white/80 rounded-full blur-[120px] animate-pulse delay-100" />
            <div className="relative inset-0 overflow-hidden pointer-events-none flex flex-col items-center pt-[40vh]">
              <h1 className="z-20 relative text-5xl font-black">Próximamente...</h1>
            </div>
          </div>
        </div>
      </> */
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