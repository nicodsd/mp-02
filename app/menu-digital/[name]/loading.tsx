import MenuPageSkeleton from "@/src/skeleton/MenuPageSkeleton";
import templates from "@/src/data/templates.json";

export default function Loading() {
  const template =
    templates.find((t) => t.template_id === "default") || templates[0];

  return <MenuPageSkeleton template={template} />;
}
