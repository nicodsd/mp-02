"use client";

//----------------IMPORTS----------------------------------------
import NavBar from "@/src/layouts/NavBar";
import FormFoods from "@/src/components/newfood_comps/FormFoods";

//----------------CONSTANTES-------------------------------------
const postFoodNav = 1;
const nombre = "Nuevo Plato";

export default function NewFood() {
  return (
    <div className="w-full asap bg-[#eeeeee]">
      <NavBar state={postFoodNav} text={nombre} />
      <FormFoods />
    </div>
  );
}
