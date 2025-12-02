import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
const tabClass = "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2";
import UserSettings from '@/src/components/dashboard/UserSettings';
import MenuItems from '@/src/components/dashboard/MenuItems';
type Food = {
    _id: string | number;
    photo: string;
    name: string;
    description: string;
    price: number | string;
    category: string;
};
export default function Panels({ user, token, foods }: { user: any; token: string; foods: Food[] }) {
    return (
        
    )
}