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
      <div className="flex flex-col p-2 justify-between items-start">
        <BttnBack />
      </div>
      <header className="p-4 mt-3 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Plato Nuevo</h1>
        <p className="text-gray-500 text-sm">Agrega un nuevo plato a tu menú. <br />
          Recuerda que puedes editar y cambiar el orden de presentación de los platos cuando quieras.
        </p>
      </header>
      <FormFoods initialCategories={categories} user={user} />
    </div>
  );
}