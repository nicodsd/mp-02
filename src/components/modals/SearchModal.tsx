import React, { useState, useEffect, useMemo } from 'react'
import SearchInput from '@/src/components/Index/filters/Search'
import RenderCards from '@/src/components/Index/foods_cards/FoodCardSearch'
import FoodsCardsOptions from '@/src/components/Index/foods_cards/FoodsCardsOptions'
import { Utensils } from 'lucide-react'

export default function SearchModal({ arrayFoods, setSearch, setShowModal, showModal, template, user, example }: any) {
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

    const entradasFoods = useMemo(() => {
        if (!Array.isArray(arrayFoods)) return [];
        return arrayFoods.filter((food: any) =>
            food.sub_category?.toLowerCase() === 'entradas' ||
            food.category?.toLowerCase() === 'entradas'
        );
    }, [arrayFoods]);

    function BtnCancel() {
        setShowModal(false)
        setQuery('')
    }

    if (!showModal) return null;

    return (
        <div
            onClick={() => setShowModal(false)}
            className={`fixed inset-0 z-100 ${template?.bgMenu || "bg-background"} overflow-hidden`}
        >
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col h-full w-full px-3 pt-4">
                <div className={`flex justify-between ${template?.textColor || "text-gray-700"} mx-1 items-center mb-4`}>
                    <h3 className='text-2xl font-bold'>Buscar</h3>
                    <button onClick={BtnCancel} className='p-2'>Cancelar</button>
                </div>

                <div className='w-full'>
                    <SearchInput
                        filterQuery={setQuery}
                        template={template}
                    />
                </div>

                {!query && entradasFoods.length > 0 && (
                    <div className="flex flex-col gap-1 mt-4">
                        <div className={`flex ml-2 items-center gap-1 ${template?.textColorOpacity || "text-gray-700/50"}`}>
                            <h2 className="text-xl font-normal">Entradas</h2>
                            <Utensils className="w-5 h-5" />
                        </div>
                        <div className={`w-full flex justify-start overflow-x-auto no-scrollbar p-0.5 rounded-xl ${template?.backgroundColor2 || "bg-background-2"}`}>
                            {entradasFoods.map((food: any) => (
                                <div key={food._id} className="rounded-lg relative">
                                    <FoodsCardsOptions
                                        user={user || { plan: "free" }}
                                        template={template}
                                        food={food}
                                        context={true}
                                        example={example}
                                        whatsapp={user?.whatsAppCart}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {query?.length > 0 && (
                    <div className='flex flex-col no-scrollbar gap-1 mt-4 overflow-y-auto pb-20'>
                        {filteredFoods.map((food: any) => (
                            <RenderCards
                                key={food._id}
                                {...food}
                                template={template}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
