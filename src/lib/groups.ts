import { db } from "../db";
import { studentGroups } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class GroupService {
    /**
     * Lista slova koja pripadaju PRVOJ polovini alfabeta
     */
    private static FIRST_HALF = ["A", "B", "C", "Č", "Ć", "D", "Đ", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    /**
     * Određuje kojoj polovini alfabeta pripada prezime.
     * Vraća 1 za prvu polovinu (A-M), 2 za drugu polovinu (N-Š).
     */
    static getAlphabetHalf(lastName: string): number {
        if (!lastName) return 1;

        // Uzimamo prvo slovo
        const firstChar = lastName.trim().charAt(0).toUpperCase();

        if (this.FIRST_HALF.includes(firstChar)) {
            return 1;
        }

        return 2;
    }

    /**
     * Pronalazi ID grupe na osnovu parametara studenta prateći konvenciju A1-D4.
     */
    static async findGroupId(
        lastName: string,
        studyProgram: "Informacioni sistemi" | "Menadzment",
        yearOfStudy: number
    ): Promise<string | null> {
        const half = this.getAlphabetHalf(lastName);

        const groups = await db
            .select()
            .from(studentGroups)
            .where(
                and(
                    eq(studentGroups.studyProgram, studyProgram),
                    eq(studentGroups.yearOfStudy, yearOfStudy),
                    eq(studentGroups.alphabetHalf, half)
                )
            )
            .limit(1);

        return groups.length > 0 ? groups[0].id : null;
    }

    /**
     * Pomoćna metoda za dobijanje naziva grupe (npr. A1) na osnovu parametara.
     */
    static getGroupName(studyProgram: string, yearOfStudy: number, alphabetHalf: number): string {
        const yearLetters = ["A", "B", "C", "D"];
        const letter = yearLetters[yearOfStudy - 1] || "A";

        let num = 1;
        if (studyProgram === "Informacioni sistemi") {
            num = alphabetHalf === 1 ? 1 : 2;
        } else {
            num = alphabetHalf === 1 ? 3 : 4;
        }

        return `${letter}${num}`;
    }
}
