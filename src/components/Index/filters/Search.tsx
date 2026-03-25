import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
interface SearchInputProps {
    placeholder?: string;
    arrayFoods: any[];
    setSearch?: (query: string) => void;
    setShowModal?: (showModal: boolean) => void;
    filterModal?: string;
    filterQuery?: (query: string) => void;
}
const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Busca tu comida...', arrayFoods, setSearch, setShowModal, filterModal, filterQuery }) => {
    const [query, setQuery] = useState(filterModal || '');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowModal?.(true);
        const filteredFoods = arrayFoods.filter((food) => food.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setQuery(e.target.value);
        filterQuery?.(e.target.value);
        setSearch?.(e.target.value);
    };
    return (
        <>
            <div className="relative flex items-center w-full">
                <input
                    onClick={() => setShowModal?.(true)}
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleSearch}
                    className="pl-10 pr-2 py-3 border z-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <FaSearch className="absolute left-3 text-red-500" />
            </div>
        </>
    );
};
export default SearchInput;