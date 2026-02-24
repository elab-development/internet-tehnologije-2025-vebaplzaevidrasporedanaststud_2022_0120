import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { holidays, holidayCalendar } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    console.log("Sync holidays route hit!");
    try {
        const session = await getAuthSession();
        console.log("Session:", session ? "Authenticated" : "Not authenticated", session?.role);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const year = new Date().getFullYear();
        console.log("Fetching holidays for year:", year);
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/RS`);

        if (!res.ok) {
            console.error("Nager.Date API error status:", res.status);
            return NextResponse.json({ error: "Greška pri povezivanju sa Nager.Date API." }, { status: 502 });
        }

        const publicHolidays = await res.json();
        console.log(`Fetched ${publicHolidays.length} holidays from API.`);
        let addedCount = 0;

        for (const holiday of publicHolidays) {
            const holidayDate = holiday.date; // Format YYYY-MM-DD

            // Provera da li već postoji
            const existing = await db.query.holidays.findFirst({
                where: eq(holidays.date, holidayDate)
            });

            if (!existing) {
                // Određivanje akademske godine
                const dt = new Date(holidayDate);
                const hYear = dt.getFullYear();
                const month = dt.getMonth();
                const academicYear = month >= 9 ? `${hYear}/${hYear + 1}` : `${hYear - 1}/${hYear}`;

                // Pronalaženje ili kreiranje kalendara
                let calendar = await db.query.holidayCalendar.findFirst({
                    where: eq(holidayCalendar.academicYear, academicYear)
                });

                if (!calendar) {
                    const [newCal] = await db.insert(holidayCalendar).values({ academicYear }).returning();
                    calendar = newCal;
                }

                // Ubacivanje praznika
                await db.insert(holidays).values({
                    date: holidayDate,
                    type: "NERADNI_DAN",
                    calendarId: calendar.id
                });
                addedCount++;
            }
        }

        console.log(`Sync complete. Added ${addedCount} new holidays.`);
        return NextResponse.json({
            success: true,
            message: `Sinhronizacija završena. Dodato novih praznika: ${addedCount}.`
        });

    } catch (error) {
        console.error("Sync holidays error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
