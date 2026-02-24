export type Role = "ADMIN" | "STUDENT";
export type SessionType = "PREDAVANJE" | "VEZBE";
export type CabinetType = "LABORATORIJSKI" | "AUDITORNI" | "AMFITEATAR";
export type DayOfWeek = "PONEDELJAK" | "UTORAK" | "SREDA" | "CETVRTAK" | "PETAK" | "SUBOTA" | "NEDELJA";
export type HolidayType = "KOLOKVIJUMSKA_NEDELJA" | "ISPITNI_ROK" | "BEZ_AKTIVNOSTI" | "NERADNI_DAN";

export interface JWTPayload {
    userId: string;
    username: string;
    role: Role;
    email: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
}

export interface Student extends User {
    indexNumber: string;
    studyProgram: string;
    yearOfStudy: number;
    pictureUrl?: string;
    groupId?: string;
}

export interface Subject {
    id: string;
    title: string;
    espb: number;
    description?: string;
}

export interface Cabinet {
    id: string;
    number: string;
    capacity: number;
    type: CabinetType;
}

export interface StudentGroup {
    id: string;
    name: string;
    studyProgram: string;
    yearOfStudy: number;
    alphabetHalf: number;
}

export interface Term {
    id: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    type: SessionType;
    subjectId: string;
    cabinetId: string;
    groupId: string;
    // Joined fields often used in UI
    subject?: string;
    cabinet?: string;
    group?: string;
}
