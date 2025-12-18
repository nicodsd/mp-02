import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
interface SearchInputProps {
    placeholder?: string;
    arrayFoods: any[];
    setSearch: (query: string) => void;
}
const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Buscar...', arrayFoods, setSearch }) => {
    const [query, setQuery] = useState('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filteredFoods = arrayFoods.filter((food) => food.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setQuery(e.target.value);
        setSearch(e.target.value);
    };
    return (
        <div className="relative flex items-center">
            <input
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={handleSearch}
                className="pl-10 pr-2 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <FaSearch className="absolute left-3 text-red-500" />
        </div>
    );
};
export default SearchInput;