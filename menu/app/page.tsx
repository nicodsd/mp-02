import { getFoods } from "@/src/lib/getFoods";
import { getCategories } from "@/src/lib/getCategories";
import NavBar from "@/src/layouts/NavBar";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
const homeState = false;
const nombre = "Menu App";

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const categories = await getCategories(apiUrl);
  const foods = await getFoods(apiUrl);

//  console.log(foods)

  return (
    <div className="w-full asap h-auto">
      <NavBar state={homeState} text={nombre} />
      <div className="w-full p-[.6rem] h-full">
        <section className="flex flex-col">
          <PromoDay />
        </section>
        <section className="flex h-full flex-col gap-0.5">
          <Categories initialCategories={categories} />
          <MenuCard initialFoods={foods} />
        </section>
      </div>
    </div>
  );
}
