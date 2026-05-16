"use client";

interface ConfigOptionCardProps {
    id: string;
    label?: string;
    selected: boolean;
    onSelect: (id: string) => void;
    children: React.ReactNode;
    format: "vertical" | "horizontal";
}

export const ConfigOptionCard: React.FC<ConfigOptionCardProps> = ({ id, label, selected, onSelect, children, format }) => {
    const isVertical = format === "vertical";

    return (
        <div
            onClick={() => {
                onSelect(id);
            }}
            className="cursor-pointer w-full group"
        >
            <div className={`relative ${isVertical ? 'flex-col items-center justify-between min-h-[140px] w-full' : 'flex-row items-center justify-between h-24'} flex-1 border-2 rounded-2xl py-3 px-4 flex bg-white transition-all duration-300 
                ${selected ? 'border-gray-900 shadow-lg scale-[1.03] md:scale-102 z-10' : 'border-gray-200 group-hover:border-gray-300'}`}>

                <div className={`flex items-center justify-center ${isVertical ? 'w-full flex-1' : 'w-20'}`}>
                    {children}
                </div>

                <div className={`flex ${isVertical ? 'flex-col mt-2' : 'flex-row'} items-center gap-2`}>
                    {label && (
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none text-center">
                            {label}
                        </span>
                    )}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                        ${selected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ConfigSwitch = ({ label, enabled, onChange }: any) => (
    <div className="flex items-center justify-between py-4 w-full border-b border-gray-100 last:border-none">
        <span className="text-[15px] text-gray-700 font-semibold">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`${enabled ? 'bg-green-500' : 'bg-gray-300'} cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-0`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200`} />
        </button>
    </div>
);