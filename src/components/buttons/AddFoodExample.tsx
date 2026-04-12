"use client"
import { useCartStoreExample } from '@/src/lib/useCartStoreExample'
import { FaPlus } from 'react-icons/fa'

export default function AddFood({ _id }: { _id: string }) {
    const { addId } = useCartStoreExample();
    return (
        <button onClick={() => { addId(_id) }} className="w-fit h-fit p-3 ml-2 border bg-green-500 border-black rounded-full flex items-center justify-center" >
            <FaPlus className="text-white" />
        </button>
    )
}