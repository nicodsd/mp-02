import React from "react";
const IndexCategoriesSkeleton: React.FC = () => {
    return (
        <section className="mt-6 text-[17px] font-medium">
            <div
                className="flex gap-7 py-1 pl-4 overflow-y-scroll overflow-x-scroll"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>
        </section>
    );
};
export default IndexCategoriesSkeleton;