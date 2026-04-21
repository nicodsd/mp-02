import categories from "@/src/data/categories.json";
import FormFoods from "@/src/pagesComponents/FormFoods";
import BttnBack from "@/src/components/buttons/BttnBack";
import { cookies } from "next/headers";
import Image from "next/image";
export default async function NewFood() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col px-2 py-3 justify-between items-start">
        <BttnBack />
      </div>
      <FormFoods initialCategories={categories} user={user} />
    </div>
  );
}