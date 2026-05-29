import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";

const CheronBttn = () => {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.replace('/', { scroll: false })}
            className="flex  items-center cursor-pointer absolute top-1 -left-2 hover:opacity-80 transition-opacity"
        >
            <MdChevronLeft className="text-3xl mr-1" />
        </button>
    );
};
export default CheronBttn;