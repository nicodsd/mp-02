import PanelUser from "@/src/pagesComponents/PanelUser";
import { cookies } from 'next/headers';
import { getFoods } from '@/src/lib/getFoods';
import NavBar from "@/src/layouts/NavBar";
const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const user = JSON.parse(userCookie);
  const state = 2;
  const foods = await getFoods(apiUrl);
  return (
    <>
      <NavBar state={state} text={user.name!} cookie={token!} photo={user.photo!} />
      <PanelUser user={user!} foods={foods!} token={token!} />
    </>
  );
}
