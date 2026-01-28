import { NextResponse } from "next/server";
import { db } from "@/db";
import { studentGroups } from "@/db/schema";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const allGroups = await db.select().from(studentGroups).orderBy(studentGroups.name);
        return NextResponse.json(allGroups);
    } catch (error) {
        return NextResponse.json(
            { error: "Neuspešno dohvatanje grupa." },
            { status: 500 }
        );
    }
}
