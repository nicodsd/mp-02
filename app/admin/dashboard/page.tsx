import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/src/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | QMenú",
  description: "Panel de administración para visualizar métricas en tiempo real.",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    redirect("/login");
  }

  const user = JSON.parse(userCookie);

  // Check if it's the admin user
  if (user.email !== "nilonb7@gmail.com") {
    redirect("/"); // Or somewhere else
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminDashboardClient user={user} />
    </div>
  );
}
