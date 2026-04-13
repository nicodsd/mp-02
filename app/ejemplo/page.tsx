import Index from "@/src/pagesComponents/Index";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import template from "@/src/data/templates.json"
export default async function Page() {
    let user = null;
    return (
        <div className="flex relative flex-col min-h-screen">
            <NavBar
                state={0}
                bttn={true}
                cookie={undefined}
                photo={user!}
                user={undefined}
            />
            <Index />
            <Footer template={template} />
        </div>
    );
}