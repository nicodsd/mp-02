import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { cookies } from 'next/headers';
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex"
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import { FaPlus } from 'react-icons/fa';
import AddFoodBttn from "@/src/components/buttons/AddFoodBttn";
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
          initialCategories={categoriesByUser!}
          foods={foodsByUser!}
          initialSubCategories={subCategoriesByUser!}
          user={user!}
          token={token!}
        /> : <Index />
      }
      {token && user &&
        <div className="fixed bottom-10 right-7 md:right-10">
          <AddFoodBttn state={true} />
        </div>
      }
      <Footer />
    </div>
  );
}