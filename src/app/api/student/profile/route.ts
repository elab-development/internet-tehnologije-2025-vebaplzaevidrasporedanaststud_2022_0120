import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, students, studentGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

// GET /api/student/profile — returns logged-in student's full profile
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

        return NextResponse.json(result[0]);
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
