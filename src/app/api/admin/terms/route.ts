import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { terms, subjects, cabinets, studentGroups } from "@/db/schema";
import { eq, and, or, lt, gt } from "drizzle-orm";
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

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const body = await req.json();
        const { dayOfWeek, startTime, endTime, type, subjectId, cabinetId, groupId } = body;

        // Basic validation
        if (!dayOfWeek || !startTime || !endTime || !type || !subjectId || !cabinetId || !groupId) {
            return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
        }

        // Conflict check: overlaps with same cabinet OR same group on same day
        const existingConflicts = await db
            .select()
            .from(terms)
            .where(
                and(
                    eq(terms.dayOfWeek, dayOfWeek),
                    or(
                        eq(terms.cabinetId, cabinetId),
                        eq(terms.groupId, groupId)
                    ),
                    // Overlap logic: newStart < existingEnd AND newEnd > existingStart
                    and(
                        lt(terms.startTime, endTime),
                        gt(terms.endTime, startTime)
                    )
                )
            );

        if (existingConflicts.length > 0) {
            const conflict = existingConflicts[0];
            const reason = conflict.cabinetId === cabinetId ? "Kabinet je zauzet" : "Grupa već ima termin";
            return NextResponse.json({
                error: `Konflikt: ${reason} u traženom periodu (${conflict.startTime.slice(0, 5)} - ${conflict.endTime.slice(0, 5)}).`
            }, { status: 409 });
        }

        const newTerm = await db.insert(terms).values({
            dayOfWeek,
            startTime,
            endTime,
            type,
            subjectId,
            cabinetId,
            groupId
        }).returning();

        return NextResponse.json(newTerm[0], { status: 201 });

    } catch (error) {
        console.error("Admin Term creation error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
