import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { terms, subjects, cabinets, studentGroups } from "@/db/schema";
import { eq, and, or, lt, gt, lte, gte } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const allTerms = await db
            .select({
                id: terms.id,
                dayOfWeek: terms.dayOfWeek,
                startTime: terms.startTime,
                endTime: terms.endTime,
                type: terms.type,
                subject: subjects.title,
                subjectId: subjects.id,
                cabinet: cabinets.number,
                cabinetId: cabinets.id,
                group: studentGroups.name,
                groupId: studentGroups.id,
            })
            .from(terms)
            .innerJoin(subjects, eq(terms.subjectId, subjects.id))
            .innerJoin(cabinets, eq(terms.cabinetId, cabinets.id))
            .innerJoin(studentGroups, eq(terms.groupId, studentGroups.id))
            .orderBy(terms.dayOfWeek, terms.startTime);

        return NextResponse.json(allTerms);

    } catch (error) {
        console.error("Admin Terms fetch error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}

// POST for creating a new term will be added in Task 3
