import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Seeding database ...");

    // Provera da li već postoje podaci
    const existingUsers = await db.select().from(schema.users).limit(1);
    if (existingUsers.length > 0) {
        console.log("Database already has data. Skipping seed to prevent data loss.");
        return;
    }

    console.log("Cleaning old data (just in case)...");
    await db.execute(sql`TRUNCATE TABLE ${schema.attendance}, ${schema.terms}, ${schema.holidays}, ${schema.holidayCalendar}, ${schema.cabinets}, ${schema.subjects}, ${schema.students}, ${schema.studentGroups}, ${schema.users} CASCADE`);


    const hashedPass = await bcrypt.hash("123", 10);
    const adminPass = await bcrypt.hash("admin123", 10);

    // Users
    console.log("Inserting users...");
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
    ]).returning();

    // Student Groups (16 groups: A1-D4)
    console.log("Inserting groups...");
    const studyPrograms = ["Informacioni sistemi", "Menadzment"] as const;
    const yearLetters = ["A", "B", "C", "D"];
    const groupEntries: (typeof schema.studentGroups.$inferInsert)[] = [];

    for (let yearIdx = 0; yearIdx < 4; yearIdx++) {
        const year = yearIdx + 1;
        const letter = yearLetters[yearIdx];

        let subCounter = 1;
        for (const sp of studyPrograms) {
            for (let half = 1; half <= 2; half++) {
                groupEntries.push({
                    name: `${letter}${subCounter++}`,
                    studyProgram: sp,
                    yearOfStudy: year,
                    alphabetHalf: half
                });
            }
        }
    }

    const groupsData = await db.insert(schema.studentGroups).values(groupEntries).returning();
    console.log(`Inserted ${groupsData.length} student groups.`);

    // Cabinets
    console.log("Inserting cabinets...");
    const cabinetsData = await db.insert(schema.cabinets).values([
        { number: "001", capacity: 30, type: "LABORATORIJSKI" },
        { number: "101", capacity: 60, type: "AUDITORNI" },
        { number: "Amfiteatar 1", capacity: 200, type: "AMFITEATAR" },
    ]).returning();

    // Subjects
    console.log("Inserting subjects...");
    const subjectsData = await db.insert(schema.subjects).values([
        { title: "Internet tehnologije", espb: 6, description: "Next.js" },
        { title: "Baze podataka", espb: 6, description: "SQL" },
        { title: "Programiranje 1", espb: 6, description: "Java" },
    ]).returning();

    // Student details
    console.log("Inserting student details...");
    const findGroup = (name: string) => groupsData.find(g => g.name === name)?.id;
    const studentsToSeed = [
        { username: "student_marko", index: "2022/0120", sp: "Informacioni sistemi", year: 1, groupName: "A2" },
        { username: "student_jovan", index: "2022/0500", sp: "Informacioni sistemi", year: 2, groupName: "B1" },
        { username: "student_ana", index: "2021/0001", sp: "Menadzment", year: 3, groupName: "C3" },
        { username: "student_maja", index: "2020/0042", sp: "Menadzment", year: 4, groupName: "D3" },
        { username: "student_petar", index: "2021/0240", sp: "Informacioni sistemi", year: 3, groupName: "C2" }
    ];

    const studentDetails = [];
    for (const s of studentsToSeed) {
        const user = userData.find(u => u.username === s.username);
        const groupId = findGroup(s.groupName);
        if (user && groupId) {
            studentDetails.push({
                userId: user.id,
                indexNumber: s.index,
                studyProgram: s.sp as (typeof schema.studyProgramEnum.enumValues[number]),
                yearOfStudy: s.year,
                groupId: groupId
            });
        }
    }

    if (studentDetails.length > 0) {
        await db.insert(schema.students).values(studentDetails);
    }

    // Holiday Calendar
    console.log("Inserting calendar...");
    const calendarData = await db.insert(schema.holidayCalendar).values({
        academicYear: "2024/2025"
    }).returning();

    await db.insert(schema.holidays).values([
        { date: "2025-01-07", type: "NERADNI_DAN", calendarId: calendarData[0].id },
        { date: "2025-02-08", type: "NERADNI_DAN", calendarId: calendarData[0].id },
        { date: "2025-02-15", type: "NERADNI_DAN", calendarId: calendarData[0].id }
    ]);

    // Terms
    console.log("Inserting terms...");
    const getSub = (title: string) => subjectsData.find(s => s.title === title)!.id;
    const getCab = (num: string) => cabinetsData.find(c => c.number === num)!.id;
    const getGrp = (name: string) => groupsData.find(g => g.name === name)!.id;

    await db.insert(schema.terms).values([
        { dayOfWeek: "PONEDELJAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: getSub("Programiranje 1"), cabinetId: getCab("Amfiteatar 1"), groupId: getGrp("A1") },
        { dayOfWeek: "PONEDELJAK", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: getSub("Programiranje 1"), cabinetId: getCab("001"), groupId: getGrp("A2") },
        { dayOfWeek: "UTORAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: getSub("Baze podataka"), cabinetId: getCab("Amfiteatar 1"), groupId: getGrp("A1") },
        { dayOfWeek: "UTORAK", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: getSub("Baze podataka"), cabinetId: getCab("101"), groupId: getGrp("B1") },
        { dayOfWeek: "SREDA", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: getSub("Internet tehnologije"), cabinetId: getCab("Amfiteatar 1"), groupId: getGrp("A1") },
        { dayOfWeek: "SREDA", startTime: "10:15:00", endTime: "12:00:00", type: "VEZBE", subjectId: getSub("Internet tehnologije"), cabinetId: getCab("001"), groupId: getGrp("C2") },
        { dayOfWeek: "CETVRTAK", startTime: "08:15:00", endTime: "23:30:00", type: "PREDAVANJE", subjectId: getSub("Internet tehnologije"), cabinetId: getCab("Amfiteatar 1"), groupId: getGrp("A1") },
        { dayOfWeek: "PETAK", startTime: "08:15:00", endTime: "23:00:00", type: "VEZBE", subjectId: getSub("Baze podataka"), cabinetId: getCab("101"), groupId: getGrp("A1") },
    ]);

    console.log("Seeding finished successfully.");
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
