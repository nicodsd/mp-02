import foodsData from "../data/foods/foods-1.json";
import Image from "next/image";

type Food = {
  id?: string | number;
  image: string;
  name: string;
  description: string;
  price: number | string;
};

export default function Cards() {
const list: Food[] = (foodsData as unknown as Food[]) || [];
  //console.log("Rendering Cards with items:", foods[0].image);

  return (
    <div>
      {list?.map((food) => (
        <div key={food?.id} className="menu-card rounded-[7px] overflow-hidden my-0.5 shadow-md flex w-full bg-white p-3.5">
          <Image
            src={food.image}
            alt={food.name}
            className="menu-card__image rounded-[7px]"
            width={500}
            height={500}
          />
          <div className="flex flex-col justify-between pl-3 w-full">
            <div className="menu-card__content text-left w-full">
              <h2 className="menu-card__title">{food.name}</h2>
              <p className="menu-card__description">{food.description}</p>
            </div>
            <div className="menu-card__price-container flex items-center gap-1.5 justify-end">
              <span className="menu-card__description">c/u</span>
              <span className="menu-card__price" >
                ${food.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
