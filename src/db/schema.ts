import {
    pgTable,
    uuid,
    text,
    varchar,
    integer,
    pgEnum,
    time,
    date,
    uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -- ENUMS --
export const roleEnum = pgEnum("role", ["ADMIN", "STUDENT"]);
export const sessionTypeEnum = pgEnum("session_type", ["PREDAVANJE", "VEZBE"]);
export const cabinetTypeEnum = pgEnum("cabinet_type", ["LABORATORIJSKI", "AUDITORNI", "AMFITEATAR"]);
export const dayOfWeekEnum = pgEnum("day_of_week", ["PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA", "NEDELJA"]);
export const holidayTypeEnum = pgEnum("holiday_type", ["KOLOKVIJUMSKA_NEDELJA", "ISPITNI_ROK", "BEZ_AKTIVNOSTI", "NERADNI_DAN"]);
export const studyProgramEnum = pgEnum("study_program", ["Informacioni sistemi", "Menadzment"]);

// -- TABLES --

// User table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("STUDENT"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
});

// Student 
export const students = pgTable("students", {
    userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    indexNumber: varchar("index_number", { length: 15 }).notNull().unique(),
    studyProgram: studyProgramEnum("study_program").notNull(),
    yearOfStudy: integer("year_of_study").notNull(),
    pictureUrl: text("picture_url"),
    groupId: uuid("group_id").references(() => studentGroups.id),
});

// Student Groups
export const studentGroups = pgTable("student_groups", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    studyProgram: studyProgramEnum("study_program").notNull(),
    yearOfStudy: integer("year_of_study").notNull(),
    alphabetHalf: integer("alphabet_half").notNull(),
});

// Subjects
export const subjects = pgTable("subjects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    espb: integer("espb").notNull(),
    description: text("description"),
});

// Cabinets
export const cabinets = pgTable("cabinets", {
    id: uuid("id").primaryKey().defaultRandom(),
    number: varchar("number", { length: 20 }).notNull().unique(),
    capacity: integer("capacity").notNull(),
    type: cabinetTypeEnum("type").notNull(),
});

// Terms 
export const terms = pgTable("terms", {
    id: uuid("id").primaryKey().defaultRandom(),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    type: sessionTypeEnum("type").notNull(),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id),
    cabinetId: uuid("cabinet_id").notNull().references(() => cabinets.id),
    groupId: uuid("group_id").notNull().references(() => studentGroups.id),
});

// Attendance Record
export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => users.id),
    termId: uuid("term_id").notNull().references(() => terms.id),
    date: date("date").notNull(),
}, (table) => ({
    unq: uniqueIndex("attendance_student_term_date_idx").on(table.studentId, table.termId, table.date),
}));

// Holiday Calendar
export const holidayCalendar = pgTable("holiday_calendar", {
    id: uuid("id").primaryKey().defaultRandom(),
    academicYear: varchar("academic_year", { length: 9 }).notNull(),
});

// Individual Holidays
export const holidays = pgTable("holidays", {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    type: holidayTypeEnum("type").notNull(),
    calendarId: uuid("calendar_id").notNull().references(() => holidayCalendar.id),
}, (table) => ({
    unq: uniqueIndex("holidays_date_idx").on(table.date),
}));

// RELATIONS

export const usersRelations = relations(users, ({ one, many }) => ({
    student: one(students, {
        fields: [users.id],
        references: [students.userId],
    }),
    attendances: many(attendance),
}));

export const studentsRelations = relations(students, ({ one }) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.id],
    }),
    group: one(studentGroups, {
        fields: [students.groupId],
        references: [studentGroups.id],
    }),
}));

export const studentGroupsRelations = relations(studentGroups, ({ many }) => ({
    students: many(students),
    terms: many(terms),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
    terms: many(terms),
}));

export const cabinetsRelations = relations(cabinets, ({ many }) => ({
    terms: many(terms),
}));

export const termsRelations = relations(terms, ({ one, many }) => ({
    subject: one(subjects, {
        fields: [terms.subjectId],
        references: [subjects.id],
    }),
    cabinet: one(cabinets, {
        fields: [terms.cabinetId],
        references: [cabinets.id],
    }),
    group: one(studentGroups, {
        fields: [terms.groupId],
        references: [studentGroups.id],
    }),
    attendances: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    user: one(users, {
        fields: [attendance.studentId],
        references: [users.id],
    }),
    term: one(terms, {
        fields: [attendance.termId],
        references: [terms.id],
    }),
}));

export const holidayCalendarRelations = relations(holidayCalendar, ({ many }) => ({
    holidays: many(holidays),
}));

export const holidaysRelations = relations(holidays, ({ one }) => ({
    calendar: one(holidayCalendar, {
        fields: [holidays.calendarId],
        references: [holidayCalendar.id],
    }),
}));
