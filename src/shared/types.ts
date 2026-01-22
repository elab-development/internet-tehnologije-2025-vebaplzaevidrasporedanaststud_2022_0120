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
    groupId?: number;
}
