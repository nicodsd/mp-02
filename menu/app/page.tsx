import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import { getCookie } from "@/src/lib/getCookie";
import { refreshPage } from './actions';
import Index from "../src/components/inicio/page";
import Footer from "@/src/layouts/Footer";
export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);
  const token = await getCookie("token");
  return (
    <>
      <Index
        initialCategories={categories!}
        initialFoods={foods!}
        token={token!}
        buttonRefresh={refreshPage}
      />
      <Footer />
    </>
  );
}