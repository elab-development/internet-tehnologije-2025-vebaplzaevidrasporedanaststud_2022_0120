import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
    try {
        await clearAuthCookie();
        return NextResponse.json({ success: true, message: "Uspešno ste se odjavili." });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Greška prilikom odjavljivanja." }, { status: 500 });
    }
}
