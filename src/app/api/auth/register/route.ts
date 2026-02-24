import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, students } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { GroupService } from "@/lib/groups";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            indexNumber,
            studyProgram,
            yearOfStudy
        } = body;

        // Basic Validation 
        if (!username || !email || !password || !firstName || !lastName || !indexNumber || !studyProgram || !yearOfStudy) {
            return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
        }

        // Name validation 
        const nameRegex = /^[a-zA-Z\s\u0100-\u017F]+$/;
        if (!nameRegex.test(firstName)) {
            return NextResponse.json({ error: "Ime može sadržati samo slova." }, { status: 400 });
        }
        if (!nameRegex.test(lastName)) {
            return NextResponse.json({ error: "Prezime može sadržati samo slova." }, { status: 400 });
        }

        // Email validation
        if (!email.includes("@")) {
            return NextResponse.json({ error: "Email adresa mora biti validna (sadržati @)." }, { status: 400 });
        }

        // Index  
        const indexRegex = /^\d{4}\/\d{4}$/;
        if (!indexRegex.test(indexNumber)) {
            return NextResponse.json({ error: "Broj indeksa mora biti u formatu XXXX/YYYY (npr. 2022/0120)." }, { status: 400 });
        }

        //  Year
        if (yearOfStudy < 1 || yearOfStudy > 4) {
            return NextResponse.json({ error: "Godina studija mora biti između 1 i 4." }, { status: 400 });
        }

        // Hash Password
        const passwordHash = await hashPassword(password);

        // Find Group Automatically
        const groupId = await GroupService.findGroupId(lastName, studyProgram, yearOfStudy);

        if (!groupId) {
            return NextResponse.json({ error: "Nije moguće dodeliti grupu. Proverite podatke." }, { status: 400 });
        }

        //  Database Transaction
        await db.transaction(async (tx) => {
            const [newUser] = await tx.insert(users).values({
                username,
                email,
                passwordHash,
                role: "STUDENT",
                firstName,
                lastName
            }).returning({ id: users.id });

            await tx.insert(students).values({
                userId: newUser.id,
                indexNumber,
                studyProgram,
                yearOfStudy,
                groupId
            });
        });

        return NextResponse.json({
            message: "Registracija uspešna! Molimo vas da se prijavite.",
            success: true
        }, { status: 201 });

    } catch (error) {
        const err = error as { code?: string, detail?: string, cause?: { code?: string, detail?: string } };
        const pgError = err.code === '23505' ? err : (err.cause?.code === '23505' ? err.cause : null);

        if (pgError) {
            const detail = pgError.detail || "";
            if (detail.includes("username")) {
                return NextResponse.json({ error: "Korisničko ime je već zauzeto." }, { status: 400 });
            }
            if (detail.includes("email")) {
                return NextResponse.json({ error: "Email adresa je već u upotrebi." }, { status: 400 });
            }
            if (detail.includes("index_number")) {
                return NextResponse.json({ error: "Broj indeksa je već registrovan." }, { status: 400 });
            }
            return NextResponse.json({ error: "Korisničko ime, email ili broj indeksa već postoji." }, { status: 400 });
        }

        console.error("Registration error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
