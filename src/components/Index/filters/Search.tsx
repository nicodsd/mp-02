import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ placeholder = 'Busca tu comida...', setSearch, setShowModal, filterModal, filterQuery, template }: any) => {
    const [localQuery, setLocalQuery] = useState(filterModal || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            filterQuery?.(localQuery);
            setSearch?.(localQuery);
        }, 200);

        return () => clearTimeout(timer);
    }, [localQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value);
    };

    return (
        <div className="relative flex items-center w-full">
            <input
                type="search"
                placeholder={placeholder}
                value={localQuery}
                onChange={handleChange}
                className={`pl-10 pr-2 py-3 border ${template?.name === "default" ? template?.accentColors[0] : "border-gray-300"} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
            />
            <FaSearch className={`absolute left-3 ${template?.name === "default" ? template?.textColor : "text-primary"}`} />
        </div>
    );
};

export default React.memo(SearchInput);