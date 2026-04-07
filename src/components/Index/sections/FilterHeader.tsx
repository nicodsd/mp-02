import Search from "@/src/components/Index/filters/Search";

export default function FilterHeader({ foods, onSearch, onOpenModal, template }: any) {
    return (
        <header className={`${template?.name === "default" ? template?.accentColors[2] : "bg-background"} rounded-2xl px-2 py-2 w-full shadow-md sticky top-13 z-20`}>
            <Search
                template={template}
                arrayFoods={foods}
                setSearch={onSearch}
                setShowModal={onOpenModal}
            />
        </header>
    );
}