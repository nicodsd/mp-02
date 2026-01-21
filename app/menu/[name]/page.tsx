"use server" //Manejo de error, si no existe usuario devuelve componente "Menu no encontrado" :)
import Footer from "@/src/layouts/Footer"; import NavBar from "@/src/layouts/NavBar"; import Menu from "@/src/pagesComponents/Menu"; import { userGet } from "@/app/api/menu/userGet"; export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params; const user = await userGet(name); if (!user?.data) { return <div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold text-gray-900">Menú no encontrado</h1></div> }
  return (
    <>
      <NavBar state={0} bttn={false} cookie={""} photo={user?.data.photo} user={user?.data} />
      <Menu data={user?.data} />
      <Footer />
    </>
  )
}