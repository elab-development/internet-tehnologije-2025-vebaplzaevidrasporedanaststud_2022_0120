import { NextResponse } from "next/server";
import { db } from "@/db";
import { holidays } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const allHolidays = await db.query.holidays.findMany({
            orderBy: [asc(holidays.date)],
            with: {
                calendar: true
            }
        });

        return NextResponse.json(allHolidays);
    } catch (error) {
        console.error("Fetch holidays error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
