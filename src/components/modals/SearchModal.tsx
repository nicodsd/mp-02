import React, { useState } from 'react'
import SearchInput from '@/src/components/Index/filters/Search'
import { motion } from 'framer-motion'
import RenderCards from '@/src/components/RenderCardsExample'

export default function SearchModal({ arrayFoods, setSearch, setShowModal, showModal, template }: { arrayFoods: any, setSearch: any, setShowModal: any, showModal: boolean, template: any }) {
    if (!showModal) return null;
    const [query, setQuery] = useState('')
    return (
        <motion.div onClick={() => setShowModal(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className='fixed inset-0 bg-black/50 backdrop-blur-sm z-100'>
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 1, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`absolute flex flex-col justify-between bottom-0 h-[80vh] rounded-t-2xl shadow-lg left-0 right-0 ${template?.primaryColor} px-3`}>
                <div className='flex w-full pt-5 h-full flex-col justify-between pb-10 rounded-2xl'>
                    <div className='flex flex-col gap-3 w-full md:px-[23vw] justify-center items-center'>
                        <div className='flex justify-center w-full items-center px-2'>
                            <SearchInput arrayFoods={arrayFoods} filterModal={query} filterQuery={setQuery} setSearch={setSearch} setShowModal={setShowModal} template={template} />
                        </div>
                        {<div className='flex flex-col h-auto min-h-[35vh] w-full justify-center items-center overflow-y-scroll'>
                            <RenderCards foods={arrayFoods} count={10} context={false} template={template} />
                        </div>}
                    </div>
                    <button onClick={() => setShowModal(false)} className='text-gray-500 flex justify-center items-center gap-2 cursor-pointer decoration'>Cancelar</button>
                </div>
            </motion.div>
        </motion.div>
    )
}