import Login from "@/src/pagesComponents/Login";


export const metadata = {
  title: "Iniciar Sesión | QMenú",
  description: "Inicia sesión en tu cuenta de QMenú para gestionar tus restaurantes y menús.",
};

export default async function LoginPage() {
    return <Login />;
}