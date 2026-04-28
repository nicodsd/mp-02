import { cookies } from "next/headers";
import { URI } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import BottomNavigation from "@/src/components/navigation/BottomNavigation";
import UserIndex from "@/src/pagesComponents/UserIndex";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json"

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || '{}';
    const userCookie = cookieStore.get("user")?.value || '{}';
    const menuCookie = cookieStore.get("menu")?.value || '{}';
    let user: any, foods, template, menu;
    if (token !== "{}" && userCookie !== "{}") {
        user = JSON.parse(userCookie);
        menu = JSON.parse(menuCookie || "");
        user = { ...user, ...menu };
        foods = await getFoodsByUser(URI, user.id);
        template = templates.find((t) => t.template_id === user?.template_id);
    }

    return (
        <div className="flex relative flex-col min-h-screen">
            <NavBar
                state={0}
                bttn={true}
                cookie={token}
                photo={user?.photo}
                user={user}
            />
            <UserIndex
                foods={foods}
                user={user}
                template={template}
                token={token || ""}
            />
            <BottomNavigation
                user={user}
                foods={foods}
                logoUrl={user?.photo}
                template={template}
            />
        </div>
    );
}