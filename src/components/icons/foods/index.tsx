"use client";
import React, { useEffect, useState } from "react";
import {
  Utensils,
  UtensilsCrossed,
  ChefHat,
  CookingPot,
  Pizza,
  Hamburger,
  Sandwich,
  Soup,
  Salad,
  Beef,
  Drumstick,
  Ham,
  Fish,
  Shrimp,
  Egg,
  EggFried,
  Carrot,
  Vegan,
  Wheat,
  Bean,
  Nut,
  Croissant,
  Donut,
  Cookie,
  Cake,
  CakeSlice,
  Dessert,
  IceCreamCone,
  IceCreamBowl,
  Popsicle,
  Candy,
  Lollipop,
  Popcorn,
  Apple,
  Banana,
  Cherry,
  Citrus,
  Grape,
  Coffee,
  CupSoda,
  GlassWater,
  Milk,
  Beer,
  Wine,
  BottleWine,
  Martini,
  Flame,
  type LucideIcon,
} from "lucide-react";

export {
  Utensils,
  UtensilsCrossed,
  ChefHat,
  CookingPot,
  Pizza,
  Hamburger,
  Sandwich,
  Soup,
  Salad,
  Beef,
  Drumstick,
  Ham,
  Fish,
  Shrimp,
  Egg,
  EggFried,
  Carrot,
  Vegan,
  Wheat,
  Bean,
  Nut,
  Croissant,
  Donut,
  Cookie,
  Cake,
  CakeSlice,
  Dessert,
  IceCreamCone,
  IceCreamBowl,
  Popsicle,
  Candy,
  Lollipop,
  Popcorn,
  Apple,
  Banana,
  Cherry,
  Citrus,
  Grape,
  Coffee,
  CupSoda,
  GlassWater,
  Milk,
  Beer,
  Wine,
  BottleWine,
  Martini,
  Flame,
};

export interface FoodIconItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export const FOOD_ICONS: FoodIconItem[] = [
  { id: "Utensils", label: "Cubiertos", Icon: Utensils },
  { id: "UtensilsCrossed", label: "Restaurante", Icon: UtensilsCrossed },
  { id: "ChefHat", label: "Especialidad", Icon: ChefHat },
  { id: "CookingPot", label: "Cazuela / Guiso", Icon: CookingPot },
  { id: "Flame", label: "Parrilla / Picante", Icon: Flame },
  { id: "Hamburger", label: "Hamburguesa", Icon: Hamburger },
  { id: "Pizza", label: "Pizza", Icon: Pizza },
  { id: "Sandwich", label: "Sándwich", Icon: Sandwich },
  { id: "Soup", label: "Sopa / Ramen", Icon: Soup },
  { id: "Salad", label: "Ensalada", Icon: Salad },
  { id: "Beef", label: "Carne", Icon: Beef },
  { id: "Drumstick", label: "Pollo", Icon: Drumstick },
  { id: "Ham", label: "Fiambres / Picada", Icon: Ham },
  { id: "Fish", label: "Pescado", Icon: Fish },
  { id: "Shrimp", label: "Mariscos", Icon: Shrimp },
  { id: "EggFried", label: "Minutas / Huevo", Icon: EggFried },
  { id: "Egg", label: "Desayuno", Icon: Egg },
  { id: "Croissant", label: "Panadería", Icon: Croissant },
  { id: "Wheat", label: "Pastas / Harinas", Icon: Wheat },
  { id: "Vegan", label: "Vegano / Veggie", Icon: Vegan },
  { id: "Carrot", label: "Verduras", Icon: Carrot },
  { id: "Bean", label: "Legumbres", Icon: Bean },
  { id: "Nut", label: "Frutos Secos", Icon: Nut },
  { id: "Dessert", label: "Postre", Icon: Dessert },
  { id: "Cake", label: "Torta", Icon: Cake },
  { id: "CakeSlice", label: "Porción de Torta", Icon: CakeSlice },
  { id: "IceCreamCone", label: "Helado", Icon: IceCreamCone },
  { id: "IceCreamBowl", label: "Copa Helada", Icon: IceCreamBowl },
  { id: "Popsicle", label: "Paleta", Icon: Popsicle },
  { id: "Donut", label: "Dona / Factura", Icon: Donut },
  { id: "Cookie", label: "Galletas", Icon: Cookie },
  { id: "Candy", label: "Dulces", Icon: Candy },
  { id: "Lollipop", label: "Golosinas", Icon: Lollipop },
  { id: "Popcorn", label: "Snacks", Icon: Popcorn },
  { id: "Coffee", label: "Café / Infusión", Icon: Coffee },
  { id: "CupSoda", label: "Gaseosa / Jugo", Icon: CupSoda },
  { id: "GlassWater", label: "Agua", Icon: GlassWater },
  { id: "Milk", label: "Lácteos / Licuado", Icon: Milk },
  { id: "Beer", label: "Cerveza", Icon: Beer },
  { id: "Wine", label: "Copa de Vino", Icon: Wine },
  { id: "BottleWine", label: "Vinos", Icon: BottleWine },
  { id: "Martini", label: "Tragos / Cócteles", Icon: Martini },
  { id: "Apple", label: "Manzana / Fruta", Icon: Apple },
  { id: "Banana", label: "Banana", Icon: Banana },
  { id: "Cherry", label: "Cereza", Icon: Cherry },
  { id: "Citrus", label: "Cítricos", Icon: Citrus },
  { id: "Grape", label: "Uvas", Icon: Grape },
];

export const FOOD_ICON_MAP: Record<string, LucideIcon> = FOOD_ICONS.reduce(
  (acc, item) => {
    acc[item.id] = item.Icon;
    return acc;
  },
  {} as Record<string, LucideIcon>
);

// Mapa por defecto para las categorías predefinidas si no tienen ícono de Lucide asignado
export const DEFAULT_CATEGORY_ICONS: Record<string, string> = {
  Entradas: "Hamburger",
  Comidas: "Pizza",
  Bebidas: "Martini",
  Postres: "Dessert",
  Ensaladas: "Salad",
  Helados: "IceCreamCone",
  Pastas: "Wheat",
  Pescados: "Fish",
  Cafés: "Coffee",
  Tortas: "Cake",
};

const STORAGE_KEY = "qmenu_category_icons";

export function saveCategoryIconLocal(categoryName: string, iconName: string) {
  if (typeof window === "undefined" || !categoryName || !iconName) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[categoryName] = iconName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (_) {}
}

export function getSavedCategoryIcon(categoryName?: string): string | undefined {
  if (typeof window === "undefined" || !categoryName) return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const map = JSON.parse(raw);
    const icon = map?.[categoryName];
    return icon && FOOD_ICON_MAP[icon] ? icon : undefined;
  } catch (_) {
    return undefined;
  }
}

export function getCategoryIconFromFoods(
  foods: any[],
  subCategory?: string
): string | undefined {
  if (!Array.isArray(foods) || foods.length === 0) return undefined;
  const targetFoods =
    subCategory && subCategory !== "0"
      ? foods.filter((f) => f?.sub_category === subCategory)
      : foods;

  const foodWithIcon = targetFoods.find(
    (f) =>
      (f?.category_icon && FOOD_ICON_MAP[f.category_icon]) ||
      (f?.icon && FOOD_ICON_MAP[f.icon])
  );
  if (foodWithIcon?.category_icon && FOOD_ICON_MAP[foodWithIcon.category_icon]) {
    return foodWithIcon.category_icon;
  }
  if (foodWithIcon?.icon && FOOD_ICON_MAP[foodWithIcon.icon]) {
    return foodWithIcon.icon;
  }
  return undefined;
}

interface FoodCategoryIconProps {
  iconName?: string | null;
  categoryName?: string;
  fallbackIcon?: string;
  size?: number;
  className?: string;
}

export function FoodCategoryIcon({
  iconName,
  categoryName,
  fallbackIcon = "Utensils",
  size = 16,
  className = "",
}: FoodCategoryIconProps) {
  const [savedIcon, setSavedIcon] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (categoryName) {
      setSavedIcon(getSavedCategoryIcon(categoryName));
    } else {
      setSavedIcon(undefined);
    }
  }, [categoryName]);

  const resolvedKey =
    (iconName && FOOD_ICON_MAP[iconName] ? iconName : null) ||
    (savedIcon && FOOD_ICON_MAP[savedIcon] ? savedIcon : null) ||
    (categoryName && DEFAULT_CATEGORY_ICONS[categoryName]
      ? DEFAULT_CATEGORY_ICONS[categoryName]
      : null) ||
    (fallbackIcon && FOOD_ICON_MAP[fallbackIcon] ? fallbackIcon : null);

  const IconComponent = resolvedKey ? FOOD_ICON_MAP[resolvedKey] : Utensils;
  return <IconComponent size={size} className={className} />;
}
