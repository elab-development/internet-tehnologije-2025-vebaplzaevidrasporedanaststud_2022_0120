import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcrypt";

async function main() {
    console.log("Seeding database...");

    //  Password hash
    const hashedPass = await bcrypt.hash("123", 10);


    // Users
    const userData = await db.insert(schema.users).values([
        {
            username: "lazar",
            email: "lazar",
            passwordHash: hashedPass,
            role: "ADMIN",
            firstName: "Lazar",
            lastName: "Nikolic"
        },
        {
            username: "marko",
            email: "marko",
            passwordHash: hashedPass,
            role: "STUDENT",
            firstName: "Marko",
            lastName: "Marković"
        }
    ]).onConflictDoNothing().returning();

    const adminId = userData.find(u => u.role === "ADMIN")?.id;
    const studentId = userData.find(u => u.role === "STUDENT")?.id;

    // Student Groups
    const groups = await db.insert(schema.studentGroups).values([
        { id: 1, name: "A1", studyProgram: "Informacioni sistemi", yearOfStudy: 1, prezimeOd: "A", prezimeDo: "G" },
        { id: 2, name: "A2", studyProgram: "Informacioni sistemi", yearOfStudy: 1, prezimeOd: "H", prezimeDo: "N" },
        { id: 3, name: "A3", studyProgram: "Informacioni sistemi", yearOfStudy: 1, prezimeOd: "O", prezimeDo: "Z" },
    ]).onConflictDoNothing().returning();

    // Students 
    if (studentId) {
        await db.insert(schema.students).values({
            userId: studentId,
            indexNumber: "2022/0120",
            studyProgram: "Informacioni sistemi",
            yearOfStudy: 1,
            groupId: 1
        }).onConflictDoNothing();
    }

    // Cabinets
    const cabinetsData = await db.insert(schema.cabinets).values([
        { id: 1, number: "001", capacity: 30, type: "LABORATORIJSKI" },
        { id: 2, number: "101", capacity: 60, type: "AUDITORNI" },
        { id: 3, number: "Amfiteatar 1", capacity: 200, type: "AMFITEATAR" },
    ]).onConflictDoNothing().returning();

    // Subjects
    const subjectsData = await db.insert(schema.subjects).values([
        { id: 1, title: "Internet tehnologije", espb: 6, description: "Next.js" },
        { id: 2, title: "Baze podataka", espb: 6, description: "SQL" },
        { id: 3, title: "Programiranje 1", espb: 6, description: "Java" },
    ]).onConflictDoNothing().returning();

    // Terms
    await db.insert(schema.terms).values([
        {
            id: 1,
            dayOfWeek: "PONEDELJAK",
            startTime: "08:15:00",
            endTime: "10:00:00",
            type: "PREDAVANJE",
            subjectId: 1,
            cabinetId: 3,
            groupId: 1
        },
        {
            id: 2,
            dayOfWeek: "UTORAK",
            startTime: "12:15:00",
            endTime: "14:00:00",
            type: "VEZBE",
            subjectId: 2,
            cabinetId: 1,
            groupId: 1
        }
    ]).onConflictDoNothing();

    // Holiday Calendar
    const calendar = await db.insert(schema.holidayCalendar).values({
        id: 1,
        name: "Akademska godina 2024/25",
        academicYear: "2024/2025"
    }).onConflictDoNothing().returning();

    if (calendar.length > 0) {
        await db.insert(schema.holidays).values([
            { id: 1, date: "2025-01-07", type: "NERADNI_DAN", calendarId: 1 },
            { id: 2, date: "2025-02-15", type: "NERADNI_DAN", calendarId: 1 }
        ]).onConflictDoNothing();
    }

    console.log("Seeding finished.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
