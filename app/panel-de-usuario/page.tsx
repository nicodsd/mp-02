import { cookies } from 'next/headers';
import { getFoodsByUser } from '@/src/lib/getFoodsByUser';
import { URI } from '@/src/lib/const';
import PanelUser from "@/src/pagesComponents/PanelUser";
import templates from "@/src/data/templates.json";
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '{}';
  const userCookie = cookieStore.get("user")?.value || '{}';
  const menuCookie = cookieStore.get("menu")?.value || '{}';
  let menu: any, user: any, foods, template;
  if (token !== "{}" && userCookie !== "{}") {
    user = JSON.parse(userCookie);
    if (menuCookie !== "{}") {
      menu = JSON.parse(menuCookie || "");
    }
    foods = await getFoodsByUser(URI, user.id);
    template = templates.find((t) => t.template_id === menu?.template_id);
    user = { ...user, ...menu };
  }
  return (
    <PanelUser user={user!} foods={foods!} token={token!} template={template!} />
  );
}