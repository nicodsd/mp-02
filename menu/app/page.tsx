import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import { refreshPage } from '@/app/actions';
import { cookies } from 'next/headers';
import Index from "@/src/pagesComponents/Index";
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
  return (
    <>
      <NavBar state={state} text={user.name!} cookie={token!} photo={user.photo!} />
      <Index
        initialCategories={categories!}
        initialFoods={foods!}
        buttonRefresh={refreshPage}
      />
      <Footer />
    </>
  );
}