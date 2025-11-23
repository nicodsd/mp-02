export default function LoadingCategories() {
    return (
        <div className="flex flex-wrap gap-4 p-4 justify-center">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                >sdasdasdas</div>
            ))};
        </div>
    );
};