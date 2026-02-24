import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { holidays, holidayCalendar } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
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

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const { date, type } = await req.json();

        if (!date || !type) {
            return NextResponse.json({ error: "Datum i tip su obavezni." }, { status: 400 });
        }

        // Determine academic year from date
        // Example: 2024-09-01 is 2024/2025, 2025-01-01 is 2024/2025
        // Schools usually start in Oct (FON), so anything from Oct to next Sep is one year.
        const dt = new Date(date);
        const year = dt.getFullYear();
        const month = dt.getMonth(); // 0-indexed
        let academicYear = "";
        if (month >= 9) { // Oct (9) or later
            academicYear = `${year}/${year + 1}`;
        } else {
            academicYear = `${year - 1}/${year}`;
        }

        // Find or create calendar
        let calendar = await db.query.holidayCalendar.findFirst({
            where: eq(holidayCalendar.academicYear, academicYear)
        });

        if (!calendar) {
            const [newCal] = await db.insert(holidayCalendar).values({
                academicYear
            }).returning();
            calendar = newCal;
        }

        // Check if holiday for this date already exists
        const existingHoliday = await db.query.holidays.findFirst({
            where: eq(holidays.date, date)
        });

        if (existingHoliday) {
            return NextResponse.json({ error: "Za ovaj datum već postoji evidentiran neradni dan." }, { status: 400 });
        }

        const [newHoliday] = await db.insert(holidays).values({
            date,
            type,
            calendarId: calendar.id
        }).returning();

        return NextResponse.json({
            ...newHoliday,
            calendar: calendar
        }, { status: 201 });
    } catch (error) {
        console.error("Create holiday error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
