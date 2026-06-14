// app/register/page.tsx
import Register from "@/src/pagesComponents/Register";


export const metadata = {
  title: "Registro de Usuario | QMenú",
  description: "Crea tu cuenta en QMenú y empieza a digitalizar tu restaurante gratis.",
};

export default function RegisterWizard() {
    return <Register />;
}