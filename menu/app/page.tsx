import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import { refreshPage } from './actions';
import { cookies } from 'next/headers';
import Index from "../src/components/inicio/page";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);
  const cookieStore = await cookies();
  const token = cookieStore.get('Set-Cookie')?.value || 'No encontrada';
  return (
    <>
      <NavBar cookie={token!} state={0} text="Menu" />
      <Index
        initialCategories={categories!}
        initialFoods={foods!}
        buttonRefresh={refreshPage}
      />
      <Footer />
    </>
  );
}