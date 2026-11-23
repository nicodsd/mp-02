import Index from "@/src/pagesComponents/Index";
import Footer from "@/src/layouts/Footer";
import NavBar from "@/src/layouts/NavBar";
import templates from "@/src/data/templates.json";

export const metadata = {
    title: "Ejemplo de Menú Digital | QMenú",
    description: "Mira un ejemplo de cómo se verá tu menú digital con QMenú.",
};

export default async function Page() {
    let user = null;
    const template = templates.find((t) => t.template_id === "magma") || templates[0];

    return (
        <div className={`flex relative flex-col min-h-screen ${template.bgMenu}`}>
            <NavBar
                state={0}
                bttn={true}
                cookie={undefined}
                photo={user!}
                template={template}
                user={undefined}
            />
            <Index template={template} />
            <Footer template={template} />
        </div>
    );
}