// app/register/page.tsx
import Register from "@/src/pagesComponents/Register";

export default function RegisterWizard() {
    return (
        <div className="relative bg-primary min-h-screen">
            <Register />
            <div className=" text-center py-10 text-xs text-white">
                <p>© {new Date().getFullYear()} QMenu. Todos los derechos reservados.</p>
                <p>Por <a className="font-bold" href="https://www.linkedin.com/in/nicobarreraj" target="_blank" rel="noopener noreferrer">Nico Barrera</a></p>
            </div>
        </div>
    );
}