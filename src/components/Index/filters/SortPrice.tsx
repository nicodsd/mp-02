import React, { useState } from 'react';
import { FaSortAmountUpAlt, FaSortAmountDownAlt, FaDollarSign } from 'react-icons/fa';
interface SortPriceButtonProps {
    onSortChange: (order: 'asc' | 'desc') => void;
    initialSortOrder?: 'asc' | 'desc';
    template?: any;
}
const SortPriceButton = ({ onSortChange, template }: SortPriceButtonProps) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        onSortChange(newOrder);
    };
    return (
        <button
            onClick={toggleSortOrder}
            className={`w-[15%] h-8 border ${template?.backgroundColor2 || "bg-background"} cursor-pointer ${template?.border || "border-gray-300"} rounded-md text-sm font-medium hover:${template?.backgroundColor2 || "bg-gray-100"} transition-colors duration-200 focus:outline-none flex items-center justify-center`}
        >
            <FaDollarSign className={`h-4 ${template?.icons || "text-primary"} w-4`} />
            {sortOrder === 'desc' ? <FaSortAmountUpAlt className={`h-4 ${template?.textColor || "text-gray-700"} w-4`} /> : <FaSortAmountDownAlt className={`h-4 ${template?.textColor || "text-gray-700"} w-4`} />}
        </button>
    );
};
export default SortPriceButton; 