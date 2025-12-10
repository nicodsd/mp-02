import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { cookies } from 'next/headers';
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex"
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function Page() {
  const state = 0;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const user = JSON.parse(userCookie);
  let foodsByUser;
  let categoriesByUser;
  if (user.id) {
    foodsByUser = await getFoodsByUser(apiUrl, user.id!);
    categoriesByUser = await getCategoriesByUser(apiUrl, user.id!);
  }
  return (
    <>
      <NavBar state={state} text={user.name!} cookie={token!} photo={user.photo!} />
      {
        user.id ? <UserIndex
          initialCategories={categoriesByUser!}
          initialFoods={foodsByUser!}
        /> : <Index
          initialCategories={categories!}
          initialFoods={foods!}
        />
      }
      <Footer />
    </>
  );
}