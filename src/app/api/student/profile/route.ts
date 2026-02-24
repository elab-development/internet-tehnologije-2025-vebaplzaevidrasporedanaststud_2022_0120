import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, students, studentGroups, attendance, terms, subjects, holidays } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";
import { countHeldTerms } from "@/lib/attendance";

interface SubjectStat {
    subjectId: string;
    subjectTitle: string;
    presence: number;
    held: number;
    absence: number;
    attendancePercentage: number;
}

interface StudentProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    indexNumber?: string | null;
    studyProgram?: "Informacioni sistemi" | "Menadzment" | null;
    yearOfStudy?: number | null;
    pictureUrl?: string | null;
    groupId?: string | null;
    groupName?: string | null;
    subjectStats?: SubjectStat[];
}

// GET /api/student/profile — returns logged-in student's full profile including attendance stats
export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const result = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                indexNumber: students.indexNumber,
                studyProgram: students.studyProgram,
                yearOfStudy: students.yearOfStudy,
                pictureUrl: students.pictureUrl,
                groupId: students.groupId,
                groupName: studentGroups.name,
            })
            .from(users)
            .innerJoin(students, eq(students.userId, users.id))
            .leftJoin(studentGroups, eq(studentGroups.id, students.groupId))
            .where(eq(users.id, session.userId))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json({ error: "Student nije pronađen." }, { status: 404 });
        }

        const profile = result[0] as StudentProfile;

        // Fetch attendance stats if group is assigned
        if (profile.groupId) {
            const studentTerms = await db
                .select({
                    id: terms.id,
                    dayOfWeek: terms.dayOfWeek,
                    subjectId: terms.subjectId,
                    subjectTitle: subjects.title,
                    type: terms.type,
                })
                .from(terms)
                .innerJoin(subjects, eq(subjects.id, terms.subjectId))
                .where(eq(terms.groupId, profile.groupId));

            const studentAttendance = await db
                .select()
                .from(attendance)
                .where(eq(attendance.studentId, session.userId));

            const allHolidays = await db
                .select({ date: holidays.date })
                .from(holidays);

            const holidayDates = allHolidays.map((h: { date: string }) => h.date);

            // Calculation parameters
            const SEMESTER_START = new Date("2026-02-16"); // Adjust if needed
            const TODAY = new Date();

            const statsMap: Record<string, {
                subjectTitle: string,
                presence: number,
                held: number,
                absence: number
            }> = {};

            for (const term of studentTerms) {
                if (!statsMap[term.subjectId]) {
                    statsMap[term.subjectId] = {
                        subjectTitle: term.subjectTitle,
                        presence: 0,
                        held: 0,
                        absence: 0
                    };
                }

                const heldCount = countHeldTerms(term.dayOfWeek, SEMESTER_START, TODAY, holidayDates);
                const presenceCount = studentAttendance.filter((a: { termId: string }) => a.termId === term.id).length;

                statsMap[term.subjectId].held += heldCount;
                statsMap[term.subjectId].presence += presenceCount;
            }

            // Calculate absences and convert to array
            profile.subjectStats = Object.entries(statsMap).map(([subjectId, stat]) => ({
                subjectId,
                subjectTitle: stat.subjectTitle,
                presence: stat.presence,
                held: stat.held,
                absence: stat.held - stat.presence,
                attendancePercentage: stat.held > 0 ? (stat.presence / stat.held) * 100 : 0
            }));
        } else {
            profile.subjectStats = [];
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json({ error: "Greška pri učitavanju podataka." }, { status: 500 });
    }
}

// PATCH /api/student/profile — update firstName, lastName, email
export async function PATCH(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const body = await req.json();
        const { username } = body;

        if (!username || username.trim().length < 3) {
            return NextResponse.json(
                { error: "Korisničko ime mora imati bar 3 karaktera." },
                { status: 400 }
            );
        }

        // Check if username is taken by another user
        const usernameConflict = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, username.trim()))
            .limit(1);

        if (usernameConflict.length > 0 && usernameConflict[0].id !== session.userId) {
            return NextResponse.json(
                { error: "Korisničko ime je već zauzeto." },
                { status: 409 }
            );
        }

        await db
            .update(users)
            .set({ username: username.trim() })
            .where(eq(users.id, session.userId));

        return NextResponse.json({ success: true, message: "Podaci su uspešno izmenjeni." });
    } catch (error) {
        console.error("Profile PATCH error:", error);
        return NextResponse.json({ error: "Greška pri čuvanju podataka." }, { status: 500 });
    }
}
