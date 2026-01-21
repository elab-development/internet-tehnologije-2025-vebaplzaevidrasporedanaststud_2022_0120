import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Korisničko ime i lozinka su obavezni." }, { status: 400 });
        }

        // Find User by Username 
        const user = await db.query.users.findFirst({
            where: eq(users.username, username)
        });

        if (!user) {
            return NextResponse.json({ error: "Pogrešno korisničko ime ili lozinka." }, { status: 401 });
        }

        //  Verify Password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: "Pogrešno korisničko ime ili lozinka." }, { status: 401 });
        }

        //  Create Session Token
        const token = await signToken({
            userId: user.id,
            username: user.username,
            role: user.role,
            email: user.email
        });

        // Set Cookie
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
