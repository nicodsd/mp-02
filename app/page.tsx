import { cookies } from "next/headers";
import { URI, logotipo } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import BottomNavigation from "@/src/components/navigation/BottomNavigation";
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import QrModalsGenerator from "@/src/components/modals/QrModalsGenerator";
export default async function Page() {
  let foodsByUser;
  let categoriesByUser;
  let subCategoriesByUser;
  let user;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    user = JSON.parse(userCookie);
    categoriesByUser = await getCategoriesByUser(URI, user.id!);
    foodsByUser = await getFoodsByUser(URI, user.id!);
    subCategoriesByUser = await getSubCategoriesByUser(URI, user.id!);
  }
  return (
    <div className="flex relative flex-col min-h-screen">
      <NavBar
        state={0}
        bttn={true}
        cookie={token!}
        photo={user?.photo!}
        user={user!}
      />
      {user ? (
        <UserIndex
          categories={categoriesByUser!}
          foods={foodsByUser!}
          initialSubCategories={subCategoriesByUser!}
          user={user!}
          token={token!}
        />
      ) : (
        <>
          <Index />
          <Footer />
        </>
      )}
      {user ? (
        <BottomNavigation
          name={user?.name! || "QMENU"}
          foods={foodsByUser!}
          logoUrl={user?.photo}
        />
      ) : (
        <BottomNavigation
          name={user?.name! || "QMENU"}
          foods={foodsByUser!}
          logoUrl={user?.photo}
        />
      )}
    </div>
  );
}
