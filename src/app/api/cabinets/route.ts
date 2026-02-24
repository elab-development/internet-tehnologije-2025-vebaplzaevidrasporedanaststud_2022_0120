import { NextResponse } from "next/server";
import { db } from "@/db";
import { cabinets } from "@/db/schema";

export async function GET() {
    try {
        const allCabinets = await db.select().from(cabinets);
        return NextResponse.json(allCabinets);
    } catch {
        return NextResponse.json(
            { error: "Neuspešno dohvatanje kabineta." },
            { status: 500 }
        );
    }
}
