import { NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema";

export async function GET() {
    try {
        const allSubjects = await db.select().from(subjects);
        return NextResponse.json(allSubjects);
    } catch {
        return NextResponse.json(
            { error: "Neuspešno dohvatanje predmeta." },
            { status: 500 }
        );
    }
}
