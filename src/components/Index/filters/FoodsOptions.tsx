"use client";
import React from 'react';
import Image from 'next/image';
import images from "@/public/images/foods-groups/imgExport";
import icons from "@/public/images/icons-index/iconExport";
const FoodGroupOptions: React.FC = () => {
    const options = [
        { name: 'Postres', icon: icons.cono },
        { name: 'Entradas', img: images.entradas, icon: icons.burga },
        { name: 'Comidas', img: images.comidas, icon: icons.filete },
        { name: 'Bebidas', img: images.bebidas, icon: icons.copa }
    ];
    return (
        <div className="flex w-full justify-center px-1 py-2 my-4 rounded-xl md:px-40 bg-gray-100">
            <div className="flex flex-wrap justify-center">
                {options.map((option, index) => (
                    <div
                        onClick={() => console.log(option.name)}
                        key={index}
                        className="flex border px-5 mr-1 mt-1 mb-1 ml-1 border-gray-400 flex-col w-[22%] h-25 cursor-pointer items-center justify-center bg-white rounded-2xl shadow-md hover:bg-gray-100 transition-colors duration-200"
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
                        <span className="text-sm mt-2 font-semibold text-gray-700">{option.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default FoodGroupOptions;