"use cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { URI } from "@/src/lib/const";
export async function userGet(name: string) {
    if (name === "QMENU") { return redirect("/ejemplo"); }
    try {
        const response = await fetch(`${URI}menu/${name}`);
        const dataDB = await response.json();
        if (dataDB.success === false) {
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