import Search from "@/src/components/Index/filters/Search";

export default function FilterHeader({ foods, onSearch, onOpenModal }: any) {
    return (
        <header className="bg-background rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20">
            <Search
                arrayFoods={foods}
                setSearch={onSearch}
                setShowModal={onOpenModal}
            />
        </header>
    );
}