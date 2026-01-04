import PanelUser from "@/src/pagesComponents/PanelUser";
import { cookies } from 'next/headers';
import { getFoodsByUser } from '@/src/lib/getFoodsByUser';
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import NavBarWrapper from '@/src/components/Index/NavBarWrapper';
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const user = JSON.parse(userCookie);
  const foods = await getFoodsByUser(apiUrl, user.id);
  const subCategories = await getSubCategoriesByUser(apiUrl, user.id);
  return (
    <>
      <NavBarWrapper state={2} text={"Panel de usuario"} cookie={token!} photo={user.photo!} user={user!} />
      <PanelUser user={user!} foods={foods!} subCategories={subCategories!} token={token!} />
    </>
  );
}