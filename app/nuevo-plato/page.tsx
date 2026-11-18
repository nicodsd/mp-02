import categories from "@/src/data/categories.json";
import FormFoods from "@/src/pagesComponents/FormFoods";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { URI } from "@/src/lib/const";
import { cookies } from "next/headers";

export const metadata = {
  title: "Nuevo Plato | QMenú",
  description: "Añade un nuevo plato a tu menú digital rápidamente.",
};

export default async function NewFood() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userId = user?.id || user?._id || "";
  const initialFoods = userId ? await getFoodsByUser(URI, userId) : [];
  return (
    <div className="w-full min-h-screen">
      <FormFoods initialCategories={categories} user={user} initialFoods={initialFoods} />
    </div>
  );
}