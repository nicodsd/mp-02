import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import Inicio from "./inicio/page";
import Footer from "@/src/layouts/Footer";

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);

  return (
    <>
      <Inicio initialCategories={categories} initialFoods={foods} />
      <Footer />
    </>
  );
}
