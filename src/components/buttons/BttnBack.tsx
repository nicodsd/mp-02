"use client";
import { useRouter } from "next/navigation";
import { MdChevronLeft } from "react-icons/md";
import Link from "next/link";

interface BttnBackProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  text?: string;
}

const BttnBack = ({ href, onClick, className, text = "Volver" }: BttnBackProps) => {
  const router = useRouter();

  const baseClassName =
    className ||
    "flex items-center text-sm cursor-pointer font-semibold hover:opacity-80 transition-opacity";

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        <MdChevronLeft className="text-xl mr-1" />
        {text}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className={baseClassName}
    >
      <MdChevronLeft className="text-xl mr-1" />
      {text}
    </button>
  );
};

export default BttnBack;
