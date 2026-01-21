import { cookies } from 'next/headers';
import { URL, logotipo } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex"
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
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    user = JSON.parse(userCookie);
    categoriesByUser = await getCategoriesByUser(URL, user.id!);
    foodsByUser = await getFoodsByUser(URL, user.id!);
    subCategoriesByUser = await getSubCategoriesByUser(URL, user.id!);
  }
  return (
    <div className="flex relative flex-col min-h-screen">
      <NavBar state={0} bttn={true} cookie={token!} photo={user?.photo!} user={user!} />
      {
        user ? <UserIndex
          categories={categoriesByUser!}
          foods={foodsByUser!}
          initialSubCategories={subCategoriesByUser!}
          user={user!}
          token={token!}
        /> : <Index />
      }
      {
        user ? (
          <div className="fixed flex-col flex gap-1.5 bottom-3 right-3 z-50">
            <QrModalsGenerator name={user?.name! || "QMENU"} logoUrl={logotipo} />
            <AddFoodBttn state={true} />
          </div>
        ) : (
          <div className="fixed bottom-6 right-4 z-50">
            <QrModalsGenerator name="QMENU" logoUrl={logotipo} />
          </div>
        )
      }
      <Footer />
    </div>
  );
}