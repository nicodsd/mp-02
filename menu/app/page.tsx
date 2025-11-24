import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import Inicio from "./inicio/page";
import { getCookie } from "@/src/lib/getCookie";
import Footer from "@/src/layouts/Footer";
export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);
  const token = await getCookie("token");
  console.log(token);
  return (
    <>
      <Inicio initialCategories={categories} initialFoods={foods} token={token!} />
      <Footer />
    </>
  );
}