"use cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { URL } from "@/src/lib/const";
export async function userGet(name: string) {
    const response = await fetch(`${URL}api/menu/${name}`);
    const dataDB = await response.json();
    if (name === "QMENU") { return redirect("/"); }
    if (response.ok) {
        return dataDB || null;
    } else {
        return NextResponse.json({ error: dataDB.message || "Fallo el registro." }, { status: 400 });
    }
}