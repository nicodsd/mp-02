import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  console.log(name);
  return (
    <>
      <NavBar state={0} text={name} cookie={""} photo={""} user={undefined} />
      <Index />
      <Footer />
    </>
  );
}