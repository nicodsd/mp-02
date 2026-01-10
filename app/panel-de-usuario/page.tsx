import { cookies } from 'next/headers';
import { getFoodsByUser } from '@/src/lib/getFoodsByUser';
import { URL } from '@/src/lib/const';
import PanelUser from "@/src/pagesComponents/PanelUser";
import NavBarWrapper from '@/src/components/Index/NavBarWrapper';
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const user = JSON.parse(userCookie);
  const foods = await getFoodsByUser(URL, user.id);
  return (
    <>
      <NavBarWrapper state={2} text={"Panel de usuario"} cookie={token!} photo={user.photo!} user={user!} />
      <PanelUser user={user!} foods={foods!} token={token!} />
    </>
  );
}