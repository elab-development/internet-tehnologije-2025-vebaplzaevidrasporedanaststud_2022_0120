import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcrypt";

async function main() {
    console.log("Seeding database...");

    // Password hashes
    const hashedPass = await bcrypt.hash("123", 10);
    const adminPass = await bcrypt.hash("admin123", 10);

    // Users
    const userData = await db.insert(schema.users).values([
        {
            username: "admin_lazar",
            email: "admin@fon.bg.ac.rs",
            passwordHash: adminPass,
            role: "ADMIN",
            firstName: "Lazar",
            lastName: "Lazić"
        },
        {
            username: "student_marko",
            email: "marko@fon.bg.ac.rs",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Marko",
            lastName: "Marković"
        },
        {
            username: "student_jovan",
            email: "jovan@fon.bg.ac.rs",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Jovan",
            lastName: "Jovanović"
        },
        {
            username: "student_ana",
            email: "ana@fon.bg.ac.rs",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Ana",
            lastName: "Anić"
        },
        {
            username: "student_maja",
            email: "maja@fon.bg.ac.rs",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Maja",
            lastName: "Majić"
        },
        {
            username: "student_petar",
            email: "petar@fon.bg.ac.rs",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Petar",
            lastName: "Petrović"
        }
    ]).onConflictDoNothing().returning();

    //Student Groups (16 groups: A1-D4)
    const studyPrograms = ["Informacioni sistemi", "Menadzment"] as const;
    const yearLetters = ["A", "B", "C", "D"];
    const groupEntries: any[] = [];
    let groupIdCounter = 1;

    for (let yearIdx = 0; yearIdx < 4; yearIdx++) {
        const year = yearIdx + 1;
        const letter = yearLetters[yearIdx];

        let subCounter = 1;
        for (const sp of studyPrograms) {
            for (let half = 1; half <= 2; half++) {
                groupEntries.push({
                    id: groupIdCounter++,
                    name: `${letter}${subCounter++}`,
                    studyProgram: sp,
                    yearOfStudy: year,
                    alphabetHalf: half
                });
            }
        }
    }

    await db.insert(schema.studentGroups).values(groupEntries).onConflictDoNothing();
    console.log(`Inserted ${groupEntries.length} student groups (A1-D4).`);

    // Students tabela
    const studentsToSeed = [
        { username: "student_marko", index: "2022/0120", sp: "Informacioni sistemi", year: 1, group: 2 }, // A2 (IS, H2 - Marković)
        { username: "student_jovan", index: "2022/0500", sp: "Informacioni sistemi", year: 2, group: 5 }, // B1 (IS, H1 - Jovanović)
        { username: "student_ana", index: "2021/0001", sp: "Menadzment", year: 3, group: 11 },           // C3 (MEN, H1 - Anić)
        { username: "student_maja", index: "2020/0042", sp: "Menadzment", year: 4, group: 15 },           // D3 (MEN, H1 - Majić)
        { username: "student_petar", index: "2021/0240", sp: "Informacioni sistemi", year: 3, group: 10 } // C2 (IS, H2 - Petrović)
    ];

    const studentDetails = [];
    for (const s of studentsToSeed) {
        const user = userData.find(u => u.username === s.username);
        if (user) {
            studentDetails.push({
                userId: user.id,
                indexNumber: s.index,
                studyProgram: s.sp as any,
                yearOfStudy: s.year,
                groupId: s.group
            });
        }
    }

    if (studentDetails.length > 0) {
        await db.insert(schema.students).values(studentDetails).onConflictDoNothing();
        console.log(`Inserted student details for ${studentDetails.length} students.`);
    }

    // Cabinets
    await db.insert(schema.cabinets).values([
        { id: 1, number: "001", capacity: 30, type: "LABORATORIJSKI" },
        { id: 2, number: "101", capacity: 60, type: "AUDITORNI" },
        { id: 3, number: "Amfiteatar 1", capacity: 200, type: "AMFITEATAR" },
    ]).onConflictDoNothing();

    // Subjects
    await db.insert(schema.subjects).values([
        { id: 1, title: "Internet tehnologije", espb: 6, description: "Next.js" },
        { id: 2, title: "Baze podataka", espb: 6, description: "SQL" },
        { id: 3, title: "Programiranje 1", espb: 6, description: "Java" },
    ]).onConflictDoNothing();

    // Holiday Calendar
    await db.insert(schema.holidayCalendar).values({
        id: 1,
        academicYear: "2024/2025"
    }).onConflictDoNothing();

    await db.insert(schema.holidays).values([
        { id: 1, date: "2025-01-07", type: "NERADNI_DAN", calendarId: 1 },
        { id: 2, date: "2025-02-15", type: "NERADNI_DAN", calendarId: 1 }
    ]).onConflictDoNothing();

    // termini 
    await db.insert(schema.terms).values([
        { id: 1, dayOfWeek: "PONEDELJAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: 3, cabinetId: 3, groupId: 1 }, // A2, Prog 1
        { id: 2, dayOfWeek: "PONEDELJAK", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: 3, cabinetId: 1, groupId: 2 },      // A2, Prog 1
        { id: 3, dayOfWeek: "UTORAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: 2, cabinetId: 3, groupId: 1 },    // B1, Baze
        { id: 4, dayOfWeek: "UTORAK", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: 2, cabinetId: 2, groupId: 5 },         // B1, Baze
        { id: 5, dayOfWeek: "SREDA", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: 1, cabinetId: 3, groupId: 1 },    // C2, IT
        { id: 6, dayOfWeek: "SREDA", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: 1, cabinetId: 1, groupId: 10 },         // C2, IT
        { id: 7, dayOfWeek: "CETVRTAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: 1, cabinetId: 3, groupId: 1 }, // C3, IT
        { id: 8, dayOfWeek: "PETAK", startTime: "08:15:00", endTime: "23:00:00", type: "VEZBE", subjectId: 2, cabinetId: 2, groupId: 1 },         // D3, Baze
    ]).onConflictDoNothing();

    console.log("Seeding finished.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
