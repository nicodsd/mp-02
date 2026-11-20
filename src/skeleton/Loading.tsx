import React from "react";

type LoadingProps = {
  count?: number;
  template?: {
    backgroundColor?: string;
    backgroundColor2?: string;
    border?: string;
  };
  variant?: "list" | "card";
};

export default function Loading({
  count = 4,
  template,
  variant = "list",
}: LoadingProps) {
  const cardBg = template?.backgroundColor || "bg-background";
  const skeletonBg = template?.backgroundColor2 || "bg-gray-200";
  const borderColor = template?.border || "border-gray-200";

  if (variant === "card") {
    return (
      <div className="flex gap-2 w-full overflow-hidden" aria-busy="true" aria-label="Cargando platos">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex flex-col w-40 h-64 shrink-0 rounded-lg border ${borderColor} ${cardBg} p-2`}
          >
            <div className={`relative skeleton-shimmer w-full h-31.25 rounded-[7px] ${skeletonBg}`} />
            <div className="flex flex-col justify-between flex-1 w-full mt-2">
              <div className="space-y-1.5">
                <div className={`relative skeleton-shimmer h-4 rounded w-4/5 ${skeletonBg}`} />
                <div className={`relative skeleton-shimmer h-3 rounded w-full opacity-70 ${skeletonBg}`} />
                <div className={`relative skeleton-shimmer h-3 rounded w-2/3 opacity-70 ${skeletonBg}`} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className={`relative skeleton-shimmer h-5 rounded w-16 ${skeletonBg}`} />
                <div className={`relative skeleton-shimmer h-7 w-7 rounded-full ${skeletonBg}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 relative w-full" aria-busy="true" aria-label="Cargando platos">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`menu-card flex w-full h-24 rounded-lg border ${borderColor} ${cardBg} p-1.5 items-center overflow-hidden`}
        >
          <div className={`relative skeleton-shimmer shrink-0 h-full w-22 md:w-24 rounded-[7px] ${skeletonBg}`} />
          <div className="flex flex-col justify-between pl-2.5 py-0.5 w-full h-full">
            <div className="space-y-1.5">
              <div className={`relative skeleton-shimmer h-4 ${skeletonBg} rounded w-2/3`} />
              <div className={`relative skeleton-shimmer h-3 ${skeletonBg} opacity-70 rounded w-full`} />
              <div className={`relative skeleton-shimmer h-3 ${skeletonBg} opacity-70 rounded w-4/5`} />
            </div>
            <div className="flex items-center gap-1.5 justify-end pr-1">
              <div className={`relative skeleton-shimmer h-3 ${skeletonBg} opacity-60 rounded w-10`} />
              <div className={`relative skeleton-shimmer h-5 ${skeletonBg} rounded w-16`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
