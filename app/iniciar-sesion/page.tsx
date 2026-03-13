import { cookies } from "next/headers";
import Login from "@/src/pagesComponents/Login";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "{}";
  const userCookie = cookieStore.get("user")?.value || "{}";
  return <Login user={userCookie} token={token} />;
}
