//----------------DATA FETCHING---------------------------------
import { getCategories } from "@/src/lib/getCategories";

//----------------IMPORTS----------------------------------------
import FormFoods from "@/src/components/newfood_comps/FormFoods";

export default async function NewFood() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const rawCategories = await getCategories(apiUrl);
  const categories = rawCategories.map((cat: any) => cat.name); // solo nombres

  return (
    <div className="w-full min-h-screen asap bg-[#eeeeee]">
      <FormFoods initialCategories={categories} />
    </div>
  );
}
