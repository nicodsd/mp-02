import { cookies } from "next/headers";
import { URI } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import BottomNavigation from "@/src/components/navigation/BottomNavigation";
import UserIndex from "@/src/pagesComponents/UserIndex";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json"

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("user")?.value;

    let user = null;
    let foodsByUser = [];
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);

            const [foods] = await Promise.all([
                getFoodsByUser(URI, user.id),
            ]);

            foodsByUser = foods;
        } catch (error) {
            console.error("Error cargando datos del usuario:", error);
        }
    }

    const template = templates.find((t) => t.template_id === user?.template_id);

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
                foods={foodsByUser}
                user={user}
                template={template}
                token={token || ""}
            />
            <BottomNavigation
                user={user}
                foods={foodsByUser}
                logoUrl={user?.photo}
                template={template}
            />
        </div>
    );
}