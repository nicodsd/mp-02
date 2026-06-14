import { cookies } from "next/headers";
import { URI } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import BottomNavigation from "@/src/components/navigation/BottomNavigation";
import UserIndex from "@/src/pagesComponents/UserIndex";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json"


export const metadata = {
  title: "Mi Menú | QMenú",
  description: "Gestiona los platos y categorías de tu menú digital de forma sencilla.",
};

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
    }
    if (user?.plan !== "free") {
        template = templates.find((t) => t.template_id === user?.template_id);
    } else {
        template = templates.find((t) => t.template_id === "default");
        user.presentation = "default"
        user.navBar = "default"
    }
    return (
        <div className="flex relative flex-col min-h-screen">
            <NavBar
                state={0}
                bttn={true}
                cookie={token}
                template={template}
                photo={user?.photo}
                user={user}
            />
            <div className={`
                ${user?.navBar === "recortado"
                    ?
                    `absolute top-34 rounded-t-full h-60 z-0 inset-0 ${template?.backgroundColor} transition-colors duration-300`
                    :
                    "hidden"
                }`
            } />
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