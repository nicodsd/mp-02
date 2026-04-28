export default function Loading({ count, template }: { count: number, template: any }) {
  return (
    <div className="space-y-2 relative w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`menu-card rounded-[7px] animate-animate overflow-hidden my-0.5 shadow flex w-full ${template?.backgroundColor || "bg-background"} p-3.5`}
        >
          <div className={`${template?.backgroundColor2 || "bg-background-2"} rounded-[7px] w-25 h-25`} />
          <div className="flex flex-col justify-between pl-3 w-full">
            <div className="space-y-2">
              <div className={`h-4 ${template?.backgroundColor2 || "bg-background-2"} rounded w-3/4`} />
              <div className={`h-3 ${template?.backgroundColor2 || "bg-background-2"} opacity-55 rounded w-full`} />
              <div className={`h-3 ${template?.backgroundColor2 || "bg-background-2"} opacity-55 rounded w-5/6`} />
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-2">
              <div className={`h-3 ${template?.backgroundColor2 || "bg-background-2"} opacity-55 rounded w-10`} />
              <div className={`h-4 ${template?.backgroundColor2 || "bg-background-2"} rounded w-16`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
