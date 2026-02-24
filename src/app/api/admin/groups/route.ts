import { NextResponse } from "next/server";
import { db } from "@/db";
import { studentGroups, students } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const allGroups = await db
            .select({
                id: studentGroups.id,
                name: studentGroups.name,
                studyProgram: studentGroups.studyProgram,
                yearOfStudy: studentGroups.yearOfStudy,
                alphabetHalf: studentGroups.alphabetHalf,
                studentCount: sql<number>`count(${students.userId})`.as("student_count"),
            })
            .from(studentGroups)
            .leftJoin(students, eq(students.groupId, studentGroups.id))
            .groupBy(studentGroups.id)
            .orderBy(studentGroups.name);

        return NextResponse.json(allGroups);
    } catch {
        return NextResponse.json(
            { error: "Neuspešno dohvatanje grupa." },
            { status: 500 }
        );
    }
}
