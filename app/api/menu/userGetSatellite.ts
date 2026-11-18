"use server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { URI } from "@/src/lib/const";
import { safeParseJson } from "@/src/lib/safeJson";

export async function userGetSatellite(name: string, location: string) {
    if (name === "QMENU") { return redirect("/ejemplo"); }
    try {
        const response = await fetch(`${URI}/menu/${name}/${location}`, {
            next: { tags: ['menu'], revalidate: 2 }
        });
        if (!response.ok) {
            return null;
        }
        const dataDB = await safeParseJson(response);
        return dataDB || null;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
