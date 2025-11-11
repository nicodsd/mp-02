"use client";
import { useState, useEffect } from "react";
import { Tab, TabPanel, TabPanels, TabGroup, TabList } from "@headlessui/react";
import axios from "axios";
import UserSettings from "../../src/components/dashboard/UserSettings";
import MenuItems from "../../src/components/dashboard/MenuItems";
import Templates from "../../src/components/dashboard/Templates";
import NavBar from "@/src/layouts/NavBar";

const homeState = false;
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
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${apiUrl}/foods`);
        setFoods(res.data.foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, []);

  const tabClass =
    "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";

  return (
    <>
    <NavBar state={homeState} text={nombre} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {["User Settings", "Menu Items", "Templates"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg 
                ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12]"}`
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
            <MenuItems dataFoods={foods} />
          </TabPanel>
          <TabPanel className={tabClass}>
            <Templates />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
    </>
  );
}