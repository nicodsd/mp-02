"use client";
import React from 'react';
import Image from 'next/image';
import images from "@/public/images/foods-groups/imgExport";
import icons from "@/public/images/icons-index/iconExport";
const FoodGroupOptions: React.FC = () => {
    const options = [
        { name: 'Entradas', img: images.entradas, icon: icons.burga },
        { name: 'Comidas', img: images.comidas, icon: icons.pizzas },
        { name: 'Bebidas', img: images.bebidas, icon: icons.copa },
        { name: 'Postres', icon: icons.cono },
    ];
    return (
        <div className="flex flex-col w-full justify-center rounded-xl gap-2 text-gray-700 md:px-40 md:bg-transparent">
            <h2 className="text-md uppercase font-bold text-start w-full"></h2>
            <div className="flex flex-wrap justify-center gap-1 w-full">
                {options.map((option, index) => (
                    <div
                        onClick={() => console.log(option.name)}
                        key={index}
                        className="flex border px-5 mt-1 mb-1 border-gray-300 flex-col w-[24%] h-25 cursor-pointer items-center justify-center hover:bg-gray-50 rounded-2xl transition-colors duration-200"
                    >
                        <Image
                            className="w-7 h-7"
                            src={option.icon}
                            alt={option.name}
                            width={100}
                            height={100}
                            quality={75}
                            loading="eager"
                        />
                        <span className="text-sm mt-2 font-semibold text-gray-600">{option.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default FoodGroupOptions;