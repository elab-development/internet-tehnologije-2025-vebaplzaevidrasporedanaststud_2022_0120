
export const DAY_MAP_REVERSE: Record<string, number> = {
    "NEDELJA": 0,
    "PONEDELJAK": 1,
    "UTORAK": 2,
    "SREDA": 3,
    "CETVRTAK": 4,
    "PETAK": 5,
    "SUBOTA": 6,
};

/**
 * Calculates how many times a specific day of the week occurred between two dates,
 * excluding holidays.
 */
export function countHeldTerms(
    dayOfWeekStr: string,
    startDate: Date,
    endDate: Date,
    holidays: string[] // Array of YYYY-MM-DD strings
): number {
    const targetDay = DAY_MAP_REVERSE[dayOfWeekStr];
    if (targetDay === undefined) return 0;

    let count = 0;
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    while (current <= end) {
        if (current.getDay() === targetDay) {
            const dateStr = current.toISOString().split('T')[0];
            if (!holidays.includes(dateStr)) {
                count++;
            }
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}
