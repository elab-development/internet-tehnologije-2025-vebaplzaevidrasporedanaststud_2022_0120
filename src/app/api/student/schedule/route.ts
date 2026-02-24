import { NextResponse } from "next/server";
import { db } from "@/db";
import { terms, students, subjects, cabinets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }


        const student = await db.query.students.findFirst({
            where: eq(students.userId, session.userId),
            with: {
                group: true
            }
        });

        if (!student || !student.group) {
            return NextResponse.json({ error: "Podaci o studentu nisu pronađeni." }, { status: 404 });
        }

        //  svi termini za grupu
        const schedule = await db
            .select({
                id: terms.id,
                dayOfWeek: terms.dayOfWeek,
                startTime: terms.startTime,
                endTime: terms.endTime,
                type: terms.type,
                subject: subjects.title,
                cabinet: cabinets.number,
            })
            .from(terms)
            .innerJoin(subjects, eq(terms.subjectId, subjects.id))
            .innerJoin(cabinets, eq(terms.cabinetId, cabinets.id))
            .where(eq(terms.groupId, student.groupId!))
            .orderBy(terms.dayOfWeek, terms.startTime);

        return NextResponse.json({
            groupName: student.group.name,
            schedule: schedule
        });

    } catch (error) {
        console.error("Schedule fetch error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
