"use client";
import { useState, useEffect } from "react";
import { Tab, TabPanel, TabPanels, TabGroup, TabList } from "@headlessui/react";
import axios from "axios";
import UserSettings from "../../src/components/dashboard/UserSettings";
import MenuItems from "../../src/components/dashboard/MenuItems";
import Templates from "../../src/components/dashboard/Templates";
import NavBar from "@/src/layouts/NavBar";

const homeState = 2;
const nombre = "Panel de usuario";

type Food = {
  _id: string | number;
  photo: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
};

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  //console.log("API URL:", apiUrl);
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Food[]>([]);
  //console.log("Foods state:", foods);

  /*   export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // continuar con fetch de datos
} */

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const resFoods = await axios.get(`${apiUrl}/foods`);
        const resCategories = await axios.get(`${apiUrl}/categories`);
        setFoods(resFoods.data.foods);
        setCategories(resCategories.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFoods();
  }, []);

  const tabClass =
    "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";

  return (
    <>
      <div className="bg-[#eeeeee] min-h-screen">
        <NavBar state={homeState} text={nombre} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabGroup>
            <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {["User Settings", "Menu Items", "Templates"].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg 
                ${
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/12"
                }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            <TabPanels className="mt-2">
              <TabPanel className={tabClass}>
                <UserSettings />
              </TabPanel>
              <TabPanel className={tabClass}>
                <MenuItems dataFoods={foods} initialCategories={categories} />
              </TabPanel>
              <TabPanel className={tabClass}>
                <Templates />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </>
  );
}
