import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { holidays } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth";

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

        await db.delete(holidays).where(eq(holidays.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete holiday error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
