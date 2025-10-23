import NavBar from "@/src/layouts/NavBar";
import Categories from "@/src/components/Categories";
import MenuCard from "@/src/components/Cards";
import PromoDay from "@/src/components/PromoDay";
const homeState = false;
const nombre = "Menu App";

export default function Home() {
  return (
    <div className="w-full asap">
      <NavBar state={homeState} text={nombre} />
      <div className="w-full p-[.6rem]">
        <section className="flex justify-center flex-col">
          <PromoDay />
        </section>
        <section className="flex flex-col gap-0.5">
          <Categories />
          <MenuCard />
        </section>
      </div>
    </div>
  );
}
