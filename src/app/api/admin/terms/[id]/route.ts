import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { terms } from "@/db/schema";
import { eq, and, or, lt, gt, ne } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const { id } = await params;

        const term = await db.query.terms.findFirst({
            where: eq(terms.id, id),
        });
        // ovo je test 
        if (!term) {
            return NextResponse.json({ error: "Termin nije pronađen." }, { status: 404 });
        }

        return NextResponse.json(term);
    } catch (error) {
        console.error("Fetch term error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { dayOfWeek, startTime, endTime, type, subjectId, cabinetId, groupId } = body;

        // Basic validation
        if (!dayOfWeek || !startTime || !endTime || !type || !subjectId || !cabinetId || !groupId) {
            return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
        }

        // Conflict check: overlaps with same cabinet OR same group on same day (EXCLUDING current term)
        const existingConflicts = await db
            .select()
            .from(terms)
            .where(
                and(
                    ne(terms.id, id),
                    eq(terms.dayOfWeek, dayOfWeek),
                    or(
                        eq(terms.cabinetId, cabinetId),
                        eq(terms.groupId, groupId)
                    ),
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

        const updatedTerm = await db
            .update(terms)
            .set({
                dayOfWeek,
                startTime: startTime.includes(':') && startTime.split(':').length === 2 ? `${startTime}:00` : startTime,
                endTime: endTime.includes(':') && endTime.split(':').length === 2 ? `${endTime}:00` : endTime,
                type,
                subjectId,
                cabinetId,
                groupId
            })
            .where(eq(terms.id, id))
            .returning();

        return NextResponse.json(updatedTerm[0]);
    } catch (error) {
        console.error("Patch term error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAuthSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Neautorizovan pristup." }, { status: 401 });
        }

        const { id } = await params;

        await db.delete(terms).where(eq(terms.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete term error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
