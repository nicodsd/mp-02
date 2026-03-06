// app/register/page.tsx
import Register from "@/src/pagesComponents/Register";

export default function RegisterWizard() {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Register />
        </div>
    );
}