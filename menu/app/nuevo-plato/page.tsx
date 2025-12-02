import { getCategories } from "@/src/lib/getCategories";
import FormFoods from "@/src/pagesComponents/FormFoods";
import NavBar from "@/src/layouts/NavBar";
import { cookies } from 'next/headers';
export default async function NewFood() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const rawCategories = await getCategories(apiUrl);
  const categories = rawCategories?.map((cat: any) => cat.name);
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';

  const state = 1;
  return (
    <div className="w-full min-h-screen asap bg-[#eeeeee]">
      <NavBar state={state} text="Nuevo plato" cookie={token!} photo="" />
      <FormFoods initialCategories={categories} />
    </div>
  );
}