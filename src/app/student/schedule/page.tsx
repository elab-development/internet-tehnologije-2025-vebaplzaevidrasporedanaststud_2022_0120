"use client";

import { useState, useEffect } from "react";
import { StudentHeader } from "@/components/StudentHeader";

interface ScheduleItem {
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: string;
    subject: string;
    cabinet: string;
}

interface ScheduleData {
    groupName: string;
    schedule: ScheduleItem[];
}

export default function SchedulePage() {
    const [data, setData] = useState<ScheduleData | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch("/api/student/schedule");
                const result = await res.json();
                if (res.ok) {
                    setData(result);
                } else {
                    setError(result.error || "Greška pri učitavanju rasporeda.");
                }
            } catch (err) {
                setError("Greška u povezivanju sa serverom.");
            }
        };

        fetchSchedule();
    }, []);

    const daysOrder = ["PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA", "NEDELJA"];

    // Grupisanje termina po danima
    const scheduleByDay = data?.schedule.reduce((acc, item) => {
        if (!acc[item.dayOfWeek]) {
            acc[item.dayOfWeek] = [];
        }
        acc[item.dayOfWeek].push(item);
        return acc;
    }, {} as Record<string, ScheduleItem[]>);

    return (
        <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            <StudentHeader activePage="raspored" />

            <section className="relative pt-48 pb-20 overflow-hidden min-h-screen">
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mx-auto max-w-5xl px-6 w-full">
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <header className="mb-12">
                        <h1 className="text-4xl font-serif font-bold text-brand-blue mb-2">
                            Raspored za grupu {data?.groupName || "..."}:
                        </h1>
                        <p className="text-brand-blue/60 font-medium">Pregled svih zakazanih termina za vašu grupu.</p>
                    </header>

                    <div className="space-y-12">
                        {daysOrder.map((day) => {
                            const daySchedule = scheduleByDay?.[day];
                            if (!daySchedule || daySchedule.length === 0) return null;

                            return (
                                <div key={day} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-xl font-bold text-brand-gold uppercase tracking-widest pl-2 border-l-4 border-brand-gold">
                                        {day}
                                    </h2>

                                    <div className="glass-morphism border border-brand-blue/20 rounded-[2rem] p-6 shadow-xl shadow-brand-blue/5 overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-brand-blue/10">
                                                    <th className="text-left py-4 px-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest">
                                                        Vreme
                                                    </th>
                                                    <th className="text-left py-4 px-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest">
                                                        Predmet
                                                    </th>
                                                    <th className="text-left py-4 px-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest">
                                                        Tip
                                                    </th>
                                                    <th className="text-left py-4 px-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest">
                                                        Kabinet
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {daySchedule.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="group border-b border-brand-blue/5 last:border-0 hover:bg-brand-blue/[0.02] transition-colors"
                                                    >
                                                        <td className="py-5 px-4">
                                                            <span className="text-sm font-bold text-brand-blue bg-brand-blue/5 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                                {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-lg font-bold text-brand-blue group-hover:text-brand-gold transition-colors leading-tight">
                                                                    {item.subject}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${item.type === 'PREDAVANJE'
                                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                                }`}>
                                                                {item.type}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                                                                <span className="text-sm font-bold text-brand-blue/70">
                                                                    {item.cabinet}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
