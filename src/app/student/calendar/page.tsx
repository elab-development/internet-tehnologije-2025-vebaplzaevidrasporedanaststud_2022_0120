"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { StudentHeader } from "@/components/StudentHeader";
import { PageHeading } from "@/components/PageHeading";
import { HolidayCalendar, ScheduleItem } from "@/components/HolidayCalendar";

interface Holiday {
    id: string;
    date: string;
    type: string;
    calendar: {
        academicYear: string;
    };
}

const DAY_INDEX: Record<string, number> = {
    PONEDELJAK: 1,
    UTORAK: 2,
    SREDA: 3,
    CETVRTAK: 4,
    PETAK: 5,
    SUBOTA: 6,
    NEDELJA: 0,
};

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function formatICSDate(d: Date) {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function formatICSDateTime(dateStr: string, timeStr: string) {
    const clean = dateStr.replace(/-/g, "");
    const timeParts = timeStr.split(":");
    return `${clean}T${pad(+timeParts[0])}${pad(+timeParts[1])}00`;
}

function generateICS(holidays: Holiday[], schedule: ScheduleItem[]): string {
    const lines: string[] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ITEH//Akademski Kalendar//SR",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Akademski Kalendar",
    ];

    // Add holidays as all-day events
    for (const h of holidays) {
        const dateStr = h.date.split("T")[0];
        const d = new Date(dateStr + "T12:00:00");
        const nextDay = new Date(d);
        nextDay.setDate(nextDay.getDate() + 1);

        const typeLabel = h.type === "NERADNI_DAN"
            ? "Neradni dan"
            : h.type === "KOLOKVIJUMSKA_NEDELJA"
                ? "Kolokvijumska nedelja"
                : h.type === "ISPITNI_ROK"
                    ? "Ispitni rok"
                    : h.type.replace(/_/g, " ");

        lines.push(
            "BEGIN:VEVENT",
            `DTSTART;VALUE=DATE:${formatICSDate(d)}`,
            `DTEND;VALUE=DATE:${formatICSDate(nextDay)}`,
            `SUMMARY:${typeLabel}`,
            `DESCRIPTION:Akademska godina: ${h.calendar?.academicYear || "N/A"}`,
            `UID:holiday-${h.id}@iteh`,
            "END:VEVENT"
        );
    }

    // Add schedule items as recurring weekly events
    // We generate events for the current semester (~16 weeks from now)
    const today = new Date();
    const startOfWeek = new Date(today);
    // Go to Monday of this week
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + diffToMonday);

    for (const item of schedule) {
        const targetDay = DAY_INDEX[item.dayOfWeek];
        if (targetDay === undefined) continue;

        // Find the first occurrence of this day from start of week
        const eventDate = new Date(startOfWeek);
        const mondayDay = startOfWeek.getDay(); // should be 1
        let diff = targetDay - mondayDay;
        if (diff < 0) diff += 7;
        eventDate.setDate(startOfWeek.getDate() + diff);

        const dateStr = `${eventDate.getFullYear()}-${pad(eventDate.getMonth() + 1)}-${pad(eventDate.getDate())}`;

        const typeLabel = item.type === "PREDAVANJE" ? "Predavanje" : "Vežbe";

        const untilDate = new Date(startOfWeek);
        untilDate.setDate(untilDate.getDate() + 16 * 7);

        lines.push(
            "BEGIN:VEVENT",
            `DTSTART:${formatICSDateTime(dateStr, item.startTime)}`,
            `DTEND:${formatICSDateTime(dateStr, item.endTime)}`,
            `RRULE:FREQ=WEEKLY;UNTIL=${formatICSDate(untilDate)}T235959`,
            `SUMMARY:${item.subject} (${typeLabel})`,
            `LOCATION:Učionica ${item.cabinet}`,
            `DESCRIPTION:${typeLabel} - ${item.subject}`,
            `UID:schedule-${item.dayOfWeek}-${item.startTime}-${item.subject.replace(/\s/g, "")}@iteh`,
            "END:VEVENT"
        );
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
}

function downloadICS(holidays: Holiday[], schedule: ScheduleItem[]) {
    const icsContent = generateICS(holidays, schedule);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "akademski-kalendar.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function StudentCalendarPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [holidaysRes, scheduleRes] = await Promise.all([
                    fetch("/api/student/holidays"),
                    fetch("/api/student/schedule")
                ]);

                const holidaysData = await holidaysRes.json();
                const scheduleData = await scheduleRes.json();

                if (holidaysRes.ok) {
                    setHolidays(holidaysData);
                } else {
                    setError(holidaysData.error || "Greška pri učitavanju praznika.");
                }

                if (scheduleRes.ok && scheduleData.schedule) {
                    setSchedule(scheduleData.schedule);
                }
            } catch {
                setError("Greška u povezivanju sa serverom.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            <StudentHeader activePage="kalendar" />

            <section className="relative pt-36 pb-20 overflow-hidden min-h-screen">
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mx-auto max-w-6xl px-6 w-full">
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <PageHeading
                            title="Akademski Kalendar"
                            subtitle="Pregled neradnih dana i rasporeda nastave. Prevucite miš preko radnog dana za detalje."
                        />
                        <div className="flex items-center gap-3">
                            {!loading && (holidays.length > 0 || schedule.length > 0) && (
                                <button
                                    onClick={() => downloadICS(holidays, schedule)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:shadow-brand-blue/30 active:scale-95"
                                >
                                    <Download size={16} />
                                    Preuzmi .ics
                                </button>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider">
                                    Vikendi su podrazumevano neradni
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-brand-blue/40 font-medium italic">
                            Učitavanje kalendara...
                        </div>
                    ) : (
                        <HolidayCalendar
                            holidays={holidays}
                            schedule={schedule}
                            readOnly
                        />
                    )}
                </div>
            </section>
        </main>
    );
}
