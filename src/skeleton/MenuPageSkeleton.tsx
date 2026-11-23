import Loading from "@/src/skeleton/Loading";
import templates from "@/src/data/templates.json";

const defaultTemplate =
  templates.find((t) => t.template_id === "default") || templates[0];

export default function MenuPageSkeleton({ template }: { template?: any }) {
  const activeTemplate = template || defaultTemplate;

  return (
    <div
      className={`flex relative flex-col min-h-screen ${
        activeTemplate?.bgMenu || "bg-background"
      }`}
    >
      {/* Header / NavBar Skeleton */}
      <header
        className={`w-full h-80 ${
          activeTemplate?.backgroundColor2 || "bg-gray-200/70"
        } flex flex-col items-center justify-center px-4 gap-3`}
      >
        <div
          className={`relative skeleton-shimmer w-28 h-28 rounded-full ${
            activeTemplate?.backgroundColor || "bg-gray-300/90"
          } border-4 ${activeTemplate?.border || "border-white/80"}`}
        />
        <div
          className={`relative skeleton-shimmer h-6 w-44 rounded-md ${
            activeTemplate?.backgroundColor || "bg-gray-300/90"
          }`}
        />
        <div
          className={`relative skeleton-shimmer h-4 w-64 max-w-full rounded-md ${
            activeTemplate?.backgroundColor || "bg-gray-300/70"
          }`}
        />
        <div className="flex items-center gap-3 mt-1">
          <div
            className={`relative skeleton-shimmer h-4 w-24 rounded-full ${
              activeTemplate?.backgroundColor || "bg-gray-300/70"
            }`}
          />
          <div
            className={`relative skeleton-shimmer h-4 w-28 rounded-full ${
              activeTemplate?.backgroundColor || "bg-gray-300/70"
            }`}
          />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main
        className={`w-full ${
          activeTemplate?.bgMenu || "bg-background"
        } relative p-3 md:p-0 md:py-6 flex-1`}
      >
        <article className="flex min-h-[calc(90vh-100px)] flex-col gap-5 sm:px-[10vw] md:px-[20vw] lg:px-[30vw] md:pb-8 md:pt-3 -translate-y-10">
          {/* Search / Filter Bar Skeleton */}
          <div
            className={`w-full h-12 rounded-xl ${
              activeTemplate?.backgroundColor || "bg-white"
            } border ${
              activeTemplate?.border || "border-gray-200"
            } shadow-sm p-2 flex items-center gap-2`}
          >
            <div
              className={`relative skeleton-shimmer h-5 w-5 rounded-full ${
                activeTemplate?.backgroundColor2 || "bg-gray-200"
              } ml-1`}
            />
            <div
              className={`relative skeleton-shimmer h-4 w-40 rounded ${
                activeTemplate?.backgroundColor2 || "bg-gray-200"
              }`}
            />
          </div>

          {/* Horizontal Cards Section Skeleton */}
          <section className="flex flex-col gap-2 pt-2">
            <div
              className={`relative skeleton-shimmer h-5 w-28 rounded ${
                activeTemplate?.backgroundColor2 || "bg-gray-200"
              } ml-2`}
            />
            <div
              className={`w-full p-1 rounded-xl ${
                activeTemplate?.backgroundColor2 || "bg-gray-100/80"
              } overflow-hidden`}
            >
              <Loading count={4} variant="card" />
            </div>
          </section>

          {/* Main Dishes Section Skeleton */}
          <section className="flex flex-col gap-2 pt-2 pb-10">
            <div
              className={`relative skeleton-shimmer h-5 w-24 rounded ${
                activeTemplate?.backgroundColor2 || "bg-gray-200"
              } ml-2`}
            />

            {/* Category Pills Skeleton */}
            <div className="flex items-center gap-2 overflow-hidden py-1">
              <div
                className={`relative skeleton-shimmer h-8 w-20 rounded-full ${
                  activeTemplate?.backgroundColor2 || "bg-gray-200"
                } shrink-0`}
              />
              <div
                className={`relative skeleton-shimmer h-8 w-24 rounded-full ${
                  activeTemplate?.backgroundColor2 || "bg-gray-200"
                } shrink-0`}
              />
              <div
                className={`relative skeleton-shimmer h-8 w-20 rounded-full ${
                  activeTemplate?.backgroundColor2 || "bg-gray-200"
                } shrink-0`}
              />
              <div
                className={`relative skeleton-shimmer h-8 w-28 rounded-full ${
                  activeTemplate?.backgroundColor2 || "bg-gray-200"
                } shrink-0`}
              />
            </div>

            {/* Cards List Skeleton */}
            <div
              className={`w-full p-1 rounded-xl ${
                activeTemplate?.backgroundColor2 || "bg-gray-100/80"
              }`}
            >
              <Loading count={5} variant="list" />
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
