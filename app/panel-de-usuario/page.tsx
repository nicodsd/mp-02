import PanelUser from "@/src/pagesComponents/PanelUser";
import { cookies } from 'next/headers';
import { getFoodsByUser } from '@/src/lib/getFoodsByUser';
import NavBarWrapper from '@/src/components/Index/NavBarWrapper';
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const user = JSON.parse(userCookie);
  const foods = await getFoodsByUser(apiUrl, user.id);
  return (
    <>
      <NavBarWrapper state={1} text={"Panel de usuario"} cookie={token!} photo={user.photo!} user={user!} />
      <PanelUser user={user!} foods={foods!} token={token!} />
    </>
  );
}