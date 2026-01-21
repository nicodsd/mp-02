import categories from "@/src/data/categories.json";
import FormFoods from "@/src/pagesComponents/FormFoods";
import NavBar from "@/src/layouts/NavBar";
import { cookies } from "next/headers";
export default async function NewFood() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user")?.value;
  const token = (await cookieStore).get("token")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  return (
    <div className="w-full min-h-screen asap">
      <NavBar
        state={1}
        bttn={false}
        cookie={token ?? ""}
        photo=""
        user={null}
      />
      <FormFoods initialCategories={categories} user={user} />
    </div>
  );
}