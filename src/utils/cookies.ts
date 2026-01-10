import { getCookie, setCookie, deleteCookie } from "cookies-next";
// Funciones globales para cookies
export const getAppCookie = (name: string, ctx?: any) => {
    return getCookie(name, ctx) || null;
};
export const setAppCookie = (name: string, value: string, options: any = {}) => {
    setCookie(name, value, { path: "/", ...options });
};
export const deleteAppCookie = (name: string) => {
    deleteCookie(name, { path: "/" });
};
