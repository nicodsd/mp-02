import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";

const CheronBttn = () => {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center cursor-pointer font-semibold hover:opacity-80 transition-opacity"
        >
            <MdChevronLeft className="text-2xl mr-1" />
        </button>
    );
};
export default CheronBttn;