import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attendance, terms, students } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const { termId } = await req.json();

        if (!termId) {
            return NextResponse.json({ error: "Nedostaje ID termina." }, { status: 400 });
        }


        const student = await db.query.students.findFirst({
            where: eq(students.userId, session.userId)
        });

        if (!student) {
            return NextResponse.json({ error: "Student nije pronađen." }, { status: 404 });
        }


        const now = new Date();
        const days = ["NEDELJA", "PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA"];
        const currentDay = days[now.getDay()];
        const currentTimeStr = now.toTimeString().split(' ')[0];
        const todayStr = now.toISOString().split('T')[0];

        const term = await db.query.terms.findFirst({
            where: eq(terms.id, termId)
        });

        if (!term) {
            return NextResponse.json({ error: "Termin ne postoji." }, { status: 404 });
        }


        if (term.groupId !== student.groupId) {
            return NextResponse.json({ error: "Ovaj termin nije predviđen za vašu grupu." }, { status: 403 });
        }


        if (term.dayOfWeek !== currentDay) {
            return NextResponse.json({ error: "Ovaj termin se ne održava danas." }, { status: 400 });
        }


        if (currentTimeStr < term.startTime || currentTimeStr > term.endTime) {
            return NextResponse.json({ error: "Termin trenutno nije u toku." }, { status: 400 });
        }

        //da li je student već prijavljen na ovaj termin
        const existing = await db.query.attendance.findFirst({
            where: and(
                eq(attendance.studentId, session.userId),
                eq(attendance.termId, termId),
                eq(attendance.date, todayStr)
            )
        });

        if (existing) {
            return NextResponse.json({ error: "Već ste se prijavili na ovaj termin." }, { status: 409 });
        }

        // upis prisustva
        await db.insert(attendance).values({
            studentId: session.userId,
            termId: termId,
            date: todayStr
        });

        return NextResponse.json({ success: true, message: "Prisustvo uspešno zabeleženo!" });

    } catch (error) {
        console.error("Attendance error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
