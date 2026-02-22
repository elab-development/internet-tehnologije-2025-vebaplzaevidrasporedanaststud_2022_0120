"use client";

import { useState, useEffect } from "react";
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
            } catch (err) {
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
                        <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider">
                                Vikendi su podrazumevano neradni
                            </span>
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
