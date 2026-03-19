import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";

const BttnBack = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center text-sm cursor-pointer font-semibold hover:opacity-80 ml-2 transition-opacity"
    >
      <MdChevronLeft className="text-xl mr-1" />
      Volver
    </button>
  );
};
export default BttnBack;