"use client";
interface PinUserPlanProps {
  plan: string;
}
export default function PinUserPlan({ plan }: PinUserPlanProps) {
  if (plan === "Gratuito") return null;
  if (plan === "plus") {
    return (
      <div className="w-fit h-fit py-1 px-3 rounded-full absolute -top-1 right-4 bg-linear-to-r from-primary to-gray-300 border-white border flex items-center justify-center">
        <p className="text-white text-xs">{plan}dddd</p>
      </div>
    );
  }
  if (plan === "prr") {
    return (
      <div className="w-fit h-fit py-1 px-3 rounded-full absolute -right-15 top-0.5 bg-linear-to-r from-gray-600 to-gray-400 border-white border flex items-center justify-center">
        <p className="text-white text-xs">{plan}</p>
      </div>
    );
  }
}
