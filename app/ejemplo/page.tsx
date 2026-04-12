import { cookies } from "next/headers";
import { URI } from "@/src/lib/const";
import { getFoodsByUser } from "@/src/lib/getFoodsByUser";
import { getCategoriesByUser } from "@/src/lib/getCategoriesByUser";
import { getSubCategoriesByUser } from "@/src/lib/getSubCategoriesByUser";
import BottomNavigation from "@/src/components/navigation/BottomNavigation";
import Index from "@/src/pagesComponents/Index";
import UserIndex from "@/src/pagesComponents/UserIndex";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json"

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userCookie = cookieStore.get("user")?.value;

    let user = null;
    let foodsByUser = [];
    let categoriesByUser = [];
    let subCategoriesByUser = [];
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);

            const [foods, categories, subCategories] = await Promise.all([
                getFoodsByUser(URI, user.id),
                getCategoriesByUser(URI, user.id),
                getSubCategoriesByUser(URI, user.id),
            ]);

            foodsByUser = foods;
            categoriesByUser = categories;
            subCategoriesByUser = subCategories;
        } catch (error) {
            console.error("Error cargando datos del usuario:", error);
        }
    }

    const userNameFormatted = user?.name
        ? user.name.toLowerCase().replace(/\s/g, "-")
        : "qmenu";
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
            {user ? (
                <>
                    <UserIndex
                        categories={categoriesByUser}
                        foods={foodsByUser}
                        initialSubCategories={subCategoriesByUser}
                        user={user}
                        template={template}
                        token={token || ""}
                    />
                    <BottomNavigation
                        name={userNameFormatted}
                        foods={foodsByUser}
                        logoUrl={user?.photo}
                        template={template}
                    />
                </>
            ) : (
                <>
                    <Index />
                    <Footer template={template} />
                </>
            )}
        </div>
    );
}