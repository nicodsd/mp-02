"use client"
import { useCartStoreExample } from '@/src/lib/useCartStoreExample'
import { FaPlus } from 'react-icons/fa'

export default function AddFoodExample({ _id }: { _id: string }) {
    const { addId } = useCartStoreExample();
    return (
        <button onClick={() => { addId(_id) }} className="w-fit h-fit text-lg p-2.5 ml-2 active:scale-70 active:opacity-80 transition-transform duration-300 bg-gray-700 rounded-full flex items-center justify-center" >
            <FaPlus className="text-white" />
        </button>
    )
}