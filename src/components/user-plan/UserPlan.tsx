"use client";
interface UserPlanProps {
  plan: string;
}
export default function UserPlan({ plan }: UserPlanProps) {
  if (plan === "Gratuito")
    return (
      <div className="w-fit h-fit py-1 px-4 rounded-full bg-gray-300 border-gray-600 border font-medium flex items-center justify-center">
        <p className="text-white text-xs">{plan}</p>
      </div>
    );
  if (plan === "plus") {
    return (
      <div className="w-fit h-fit py-1 px-4 rounded-full bg-linear-to-r from-primary to-gray-400 font-medium flex items-center justify-center">
        <p className="text-white text-xs">{plan}</p>
      </div>
    );
  }
  if (plan === "premium") {
    return (
      <div className="w-fit h-fit py-1 px-3 rounded-full bg-linear-to-r from-black to-gray-600 border-white border flex items-center justify-center">
        <p className="text-white text-xs">{plan}</p>
      </div>
    );
  }
}
