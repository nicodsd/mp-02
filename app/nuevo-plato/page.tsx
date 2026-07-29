import categories from "@/src/data/categories.json";
import FormFoods from "@/src/pagesComponents/FormFoods";
import { cookies } from "next/headers";

export const metadata = {
  title: "Nuevo Plato | QMenú",
  description: "Añade un nuevo plato a tu menú digital rápidamente.",
};

export default async function NewFood() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  return (
    <div className="w-full min-h-screen">
      <FormFoods initialCategories={categories} user={user} />
    </div>
  );
}