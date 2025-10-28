import { FC } from 'react';
import categories from '../data/categories';

const Categories: FC = () => {
    return (
        <section className="mt-9 text-[17px] font-weight-500">
            <div 
                className="flex gap-10 py-2 pl-5 overflow-y-scroll"
                style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    
                }}
            >
                {categories.map((category) => (
                    <a
                        key={category.id}
                        href={`/#`}
                        className="py-0.5 no-underline text-[#222] border-b-[3px] border-transparent font-bold hover:border-red-600 focus:border-red-600"
                    >
                        {category.name}
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Categories;