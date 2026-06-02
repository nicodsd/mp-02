"use server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { URI } from "@/src/lib/const";

export async function userGetSatellite(name: string, location: string) {
    if (name === "QMENU") { return redirect("/ejemplo"); }
    try {
        const response = await fetch(`${URI}/menu/${name}/${location}`);
        const dataDB = await response.json();
        if (!response.ok) {
            return null;
        }
        if (response.ok) {
            return dataDB || null;
        } else {
            return NextResponse.json({ error: dataDB.message || "Fallo el registro." }, { status: 400 });
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
