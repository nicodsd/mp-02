type LoadingProps = {
  error?: string | null;
};

export default function Loading({ error }: LoadingProps) {
  console.log("ERROR PAGE LOAD:", error)
  if (error) {
    return (
      <div className="p-20 text-center h-[35vh] text-lg flex justify-center items-center bg-red-100 border border-red-400 text-red-700 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="menu-card rounded-[7px] overflow-hidden my-0.5 shadow-md flex w-full bg-white p-3.5"
        >
          <div className="bg-gray-300 rounded-[7px] w-[100px] h-[100px]" />
          <div className="flex flex-col justify-between pl-3 w-full">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-2">
              <div className="h-3 bg-gray-200 rounded w-10" />
              <div className="h-4 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
