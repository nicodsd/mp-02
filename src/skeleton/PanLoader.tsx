export default function CookingLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-6">

            <div className="relative w-64 h-56 overflow-hidden">

                {/* Ingredientes */}
                <div className="absolute z-10 left-3/7 bottom-18 -translate-x-1/2">

                    <span className="food w-3 h-3 bg-red-500 rounded-full tomato"></span>
                    <span className="food w-3 h-3 bg-red-500 rounded-full carrot"></span>
                    <span className="food w-3 h-3 bg-red-500 rounded-full broccoli"></span>

                </div>

                {/* Sartén */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pan">

                    <svg width="150" height="90" fill="none" viewBox="0 0 180 90"><rect width="65" height="10" x="90" y="40" fill="#222" rx="5" /><ellipse cx="70" cy="45" fill="#000" rx="48" ry="22" /><ellipse cx="70" cy="43" fill="#222" rx="42" ry="11" /></svg>

                </div>

            </div>

            <p className="text-lg font-semibold text-gray-700 animate-pulse">
                Preparando tu menú...
            </p>

        </div>
    );
}