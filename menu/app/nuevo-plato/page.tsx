import { getCategories } from "@/src/lib/getCategories";
import categories from "@/src/data/categories.json";
import FormFoods from "@/src/pagesComponents/FormFoods";
import NavBar from "@/src/layouts/NavBar";
import { cookies } from 'next/headers';
let user;
const cookieStore = await cookies();
const userCookie = cookieStore.get("user")?.value;
const token = cookieStore.get('token')?.value;
if (userCookie) {
  user = JSON.parse(userCookie);
}
export default async function NewFood() {
  const state = 1;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  //const rawCategories = await getCategories(apiUrl);
  //const categories = rawCategories?.map((cat: any) => cat.name);  
  // const cookieStore = await cookies();

  return (
    <div className="w-full min-h-screen asap bg-[#eeeeee]">
      <NavBar state={state} text="Nuevo plato" cookie={token!} photo="" user={user!} />
      <FormFoods initialCategories={categories} user={user!} />
    </div>
  );
}