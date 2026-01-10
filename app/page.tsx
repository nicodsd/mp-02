import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { cookies } from 'next/headers';
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex"
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
import QrModalsGenerator from "@/src/components/modals/QrModalsGenerator";
import logo from "@/public/images/logo/LOGO2.svg";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function Page() {
  let foodsByUser;
  let categoriesByUser;
  let subCategoriesByUser;
  let user;
  let description;
  description = "Comida al paso.";
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get("user")?.value;
  if (userCookie) {
    user = JSON.parse(userCookie);
    if (user.description) {
      description = user.description;
    }
    categoriesByUser = await getCategoriesByUser(apiUrl, user.id!);
    foodsByUser = await getFoodsByUser(apiUrl, user.id!);
    subCategoriesByUser = await getSubCategoriesByUser(apiUrl, user.id!);
  }
  return (
    <div className="flex relative flex-col min-h-screen">
      <NavBar state={0} text={user?.name!} cookie={token!} photo={user?.photo!} user={user!} description={description!} />
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
            <QrModalsGenerator name={user?.name! || "QMENU"} id={user?.id! || "456"} logoUrl={logo.src} />
            <AddFoodBttn state={true} />
          </div>
        ) : (
          <div className="fixed bottom-6 right-4 z-50">
            <QrModalsGenerator name="QMENU" id="456" logoUrl={logo.src} />
          </div>
        )
      }
      <Footer />
    </div>
  );
}