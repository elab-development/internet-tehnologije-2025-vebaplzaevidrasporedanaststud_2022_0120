import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { terms, students, subjects, cabinets } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        //izvlacenje grupe studenta 
        const studentInfo = await db.query.students.findFirst({
            where: eq(students.userId, session.userId)
        });

        if (!studentInfo || !studentInfo.groupId) {
            return NextResponse.json({ error: "Student nije dodeljen nijednoj grupi." }, { status: 404 });
        }

        //Trenutno vreme
        const now = new Date();
        const days = ["NEDELJA", "PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA"];
        const currentDay = days[now.getDay()] as any;

        const currentTImeStr = now.toTimeString().split(' ')[0]; // npr "13:52:57"

        // pretraga termina
        const activeTerm = await db.select({
            id: terms.id,
            subject: subjects.title,
            type: terms.type,
            startTime: terms.startTime,
            endTime: terms.endTime,
            cabinet: cabinets.number,
            dayOfWeek: terms.dayOfWeek
        })
            .from(terms)
            .leftJoin(subjects, eq(terms.subjectId, subjects.id))
            .leftJoin(cabinets, eq(terms.cabinetId, cabinets.id))
            .where(
                and(
                    eq(terms.groupId, studentInfo.groupId),
                    eq(terms.dayOfWeek, currentDay),
                    lte(terms.startTime, currentTImeStr),
                    gte(terms.endTime, currentTImeStr)
                )
            )
            .limit(1);

        if (activeTerm.length === 0) {
            return NextResponse.json({ exists: false });
        }

        return NextResponse.json({
            exists: true,
            term: activeTerm[0]
        });

    } catch (error) {
        console.error("Error fetching current term:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
