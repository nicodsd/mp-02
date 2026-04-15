import { cookies } from 'next/headers';
import { getFoodsByUser } from '@/src/lib/getFoodsByUser';
import { URI } from '@/src/lib/const';
import PanelUser from "@/src/pagesComponents/PanelUser";
import NavBarWrapper from '@/src/components/Index/NavBarWrapper';
import templates from "@/src/data/templates.json";
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  let user: any, foods, template;
  if (token !== "{}" && userCookie !== "{}") {
    user = JSON.parse(userCookie);
    foods = await getFoodsByUser(URI, user.id);
    template = templates.find((t) => t.template_id === user?.template_id);
  }
  return (
    <>
      <NavBarWrapper state={2} text={"Panel de usuario"} cookie={token!} photo={user?.photo!} user={user!} />
      <PanelUser user={user!} foods={foods!} token={token!} template={template!} />
    </>
  );
}