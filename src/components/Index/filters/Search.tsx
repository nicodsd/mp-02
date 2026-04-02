import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
interface SearchInputProps {
    placeholder?: string;
    arrayFoods: any[];
    setSearch?: (query: string) => void;
    setShowModal?: (showModal: boolean) => void;
    filterModal?: string;
    filterQuery?: (query: string) => void;
    template?: any;
}
const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Busca tu comida...', setSearch, setShowModal, filterModal, filterQuery, template }) => {
    const [query, setQuery] = useState(filterModal || '');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowModal?.(true);
        setQuery(e.target.value);
        filterQuery?.(e.target.value);
        setSearch?.(e.target.value);
    };
    console.log(template?.accentColors[0])
    return (
        <>
            <div className={`relative flex items-center w-full`}>
                <input
                    onClick={() => setShowModal?.(true)}
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleSearch}
                    className={`pl-10 pr-2 py-3 border ${template?.accentColors[0]} border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
                />
                <FaSearch className={`absolute left-3 ${template?.textColor}`} />
            </div>
        </>
    );
};
export default SearchInput;