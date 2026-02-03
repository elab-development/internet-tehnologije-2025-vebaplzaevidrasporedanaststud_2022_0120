import { NextResponse } from "next/server";
import { db } from "@/db";
import { terms, students, studentGroups } from "@/db/schema";
import { count } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const [termsCountResult] = await db.select({ count: count() }).from(terms);
        const [studentsCountResult] = await db.select({ count: count() }).from(students);
        const [groupsCountResult] = await db.select({ count: count() }).from(studentGroups);

        return NextResponse.json({
            termsCount: Number(termsCountResult?.count ?? 0),
            studentsCount: Number(studentsCountResult?.count ?? 0),
            groupsCount: Number(groupsCountResult?.count ?? 0),
        });

    } catch (error) {
        console.error("Admin Stats fetch error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
