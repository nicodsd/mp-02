import React, { useState } from 'react'
import SearchInput from '@/src/components/Index/filters/Search'
import RenderCards from '@/src/components/RenderCardsExample'

export default function SearchModal({ arrayFoods, setSearch, setShowModal, showModal }: { arrayFoods: any, setSearch: any, setShowModal: any, showModal: boolean }) {
    if (!showModal) return null;
    const [query, setQuery] = useState('')
    return (
        <div onClick={() => setShowModal(false)} className='fixed inset-0 bg-black/50 backdrop-blur-sm z-100'>
            <div onClick={(e) => e.stopPropagation()} className='absolute flex flex-col justify-between bottom-0 h-[70vh] rounded-t-2xl shadow-lg left-0 right-0 bg-background px-3'>
                <div className='flex w-full pt-5 h-full flex-col justify-between pb-10 rounded-2xl'>
                    <div className='flex flex-col gap-3 w-full md:px-[23vw] justify-center items-center'>
                        <div className='flex justify-center w-full items-center px-2'>
                            <SearchInput arrayFoods={arrayFoods} filterModal={query} filterQuery={setQuery} setSearch={setSearch} setShowModal={setShowModal} />
                        </div>
                        {<div className='flex flex-col h-auto min-h-[35vh] w-full justify-center items-center overflow-y-scroll gap-2'>
                            <RenderCards foods={arrayFoods} count={10} context={false} />
                        </div>}
                    </div>
                    <button onClick={() => setShowModal(false)} className='text-gray-500 flex justify-center items-center gap-2 cursor-pointer decoration'>Cancelar</button>
                </div>
            </div>
        </div>
    )
}