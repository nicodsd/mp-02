import allergens from "@/src/data/allergens";
const selected: string[] = [];

export default function Allergens() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {allergens.map((a) => (
          <label className="cursor-pointer">
            <input
              type="checkbox"
              name="allergens"
              value={a}
              checked={selected.includes(a)}
              className="peer hidden"
            />
            <span className="px-4 py-2 rounded-full border border-gray-300 text-sm bg-gray-100 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600">
              {a}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}
