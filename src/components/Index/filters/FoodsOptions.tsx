"use client";
import React from "react";
type Category = {
    _id: string | number;
    name: string;
    icon: string;
};
const FoodGroupOptions: React.FC<{
    selectedCategory: string;
    handleCategoryClick: (category: string) => void;
    availableCategories: Category[];
}> = ({ selectedCategory, handleCategoryClick, availableCategories }) => {
    return (
        <div className="flex flex-col w-full justify-center rounded-xl gap-2 text-gray-700 md:px-40 md:bg-transparent">
            <div className="flex flex-wrap justify-center gap-1 w-full">
                {availableCategories.map((option, index) => (
                    <button
                        onClick={() => handleCategoryClick(option.name)}
                        key={index}
                        className={`flex border border-gray-300 px-5 mt-1 mb-1 flex-col w-[24%] h-25 cursor-pointer items-center justify-center hover:bg-gray-50 rounded-2xl transition-colors duration-200 ${selectedCategory === option.name
                            ? "bg-orange-100 border-orange-600"
                            : ""
                            }`}
                    >
                        <img
                            className="w-7 h-7"
                            src={option.icon}
                            alt={option.name}
                        />
                        <span className={`text-sm mt-2 font-semibold ${selectedCategory === option.name
                            ? "text-gray-800"
                            : "text-gray-800"
                            }`}>
                            {option.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FoodGroupOptions;