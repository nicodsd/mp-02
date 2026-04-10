import React, { useState, useEffect, useMemo } from 'react'
import SearchInput from '@/src/components/Index/filters/Search'
import RenderCards from '@/src/components/RenderCardsExample'

export default function SearchModal({ arrayFoods, setSearch, setShowModal, showModal, template }: any) {
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);
    const filteredFoods = useMemo(() => {
        if (!query) return [];
        return arrayFoods.filter((food: any) =>
            food.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, arrayFoods]);

    if (!showModal) return null;

    return (
        <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-100 bg-white overflow-hidden"
        >
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col h-full w-full px-3 pt-4">
                <div className='flex justify-between text-gray-700 mx-1 items-center mb-4'>
                    <h3 className='text-2xl font-bold'>Buscar</h3>
                    <button onClick={() => setShowModal(false)} className='p-2'>Cancelar</button>
                </div>

                <div className='w-full'>
                    <SearchInput
                        filterQuery={setQuery}
                        template={template}
                    />
                </div>

                {query.length > 0 && (
                    <div className='flex-1 mt-4 overflow-y-auto pb-20'>
                        <RenderCards
                            foods={filteredFoods}
                            count={10}
                            template={template}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}