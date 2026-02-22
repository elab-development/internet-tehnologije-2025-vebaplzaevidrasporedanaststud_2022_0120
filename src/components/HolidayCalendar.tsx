"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScheduleItem {
    subject: string;
    type: string;
    startTime: string;
    endTime: string;
    cabinet: string;
    dayOfWeek: string;
}

interface HolidayCalendarProps {
    holidays: Array<{ date: string; type: string }>;
    onToggleDate?: (date: Date) => void;
    readOnly?: boolean;
    schedule?: ScheduleItem[];
}

const DAY_MAP: Record<number, string> = {
    1: "PONEDELJAK",
    2: "UTORAK",
    3: "SREDA",
    4: "CETVRTAK",
    5: "PETAK",
    6: "SUBOTA",
    0: "NEDELJA",
};

export const HolidayCalendar: React.FC<HolidayCalendarProps> = ({ holidays, onToggleDate, readOnly = false, schedule = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const getScheduleForDay = (dayOfWeek: number): ScheduleItem[] => {
        const dayName = DAY_MAP[dayOfWeek];
        return schedule.filter(s => s.dayOfWeek === dayName);
    };

    const renderHeader = () => {
        const monthNames = [
            "Januar", "Februar", "Mart", "April", "Maj", "Jun",
            "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
        ];
        return (
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl font-bold text-brand-blue">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="p-2 hover:bg-brand-blue/5 rounded-xl transition-colors text-brand-blue/60"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="p-2 hover:bg-brand-blue/5 rounded-xl transition-colors text-brand-blue/60"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-brand-blue/30 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(year, month);
        let firstDay = firstDayOfMonth(year, month);

        // Adjust for Monday start (JS getDay() is 0 for Sunday)
        firstDay = firstDay === 0 ? 6 : firstDay - 1;

        const cells = [];

        // Empty cells for padding
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-16 md:h-20" />);
        }

        // Day cells
        for (let day = 1; day <= numDays; day++) {
            const date = new Date(year, month, day);
            // Fix: Use local date components to avoid timezone shifts
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isDatabaseHoliday = holidays.some((h: { date: string }) => {
                const hDate = new Date(h.date);
                const hYYYY = hDate.getFullYear();
                const hMM = String(hDate.getMonth() + 1).padStart(2, '0');
                const hDD = String(hDate.getDate()).padStart(2, '0');
                const hDateStr = `${hYYYY}-${hMM}-${hDD}`;
                return hDateStr === dateStr;
            });

            const isHoliday = isWeekend || isDatabaseHoliday;
            const daySchedule = !isHoliday && schedule.length > 0 ? getScheduleForDay(date.getDay()) : [];
            const hasSchedule = daySchedule.length > 0;

            const CellTag = readOnly ? 'div' : 'button';
            cells.push(
                <CellTag
                    key={day}
                    onClick={readOnly ? undefined : () => onToggleDate?.(date)}
                    className={cn(
                        "h-16 md:h-20 flex flex-col items-center justify-center rounded-2xl transition-all relative group overflow-visible",
                        readOnly ? "cursor-default" : "cursor-pointer",
                        isHoliday
                            ? "bg-red-50 text-red-600 border-2 border-red-100" + (readOnly ? "" : " hover:bg-red-100")
                            : "bg-white border-2 border-transparent" + (readOnly ? "" : " hover:border-brand-blue/10 hover:bg-brand-blue/[0.02]") + " text-brand-blue/80"
                    )}
                >
                    <span className="text-lg font-bold z-10">{day}</span>
                    {isHoliday && (
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {hasSchedule && !isHoliday && (
                        <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-blue/40" />
                    )}
                    {!readOnly && <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />}

                    {/* Tooltip */}
                    {hasSchedule && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-brand-blue text-white rounded-xl p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">Raspored</div>
                            {daySchedule.map((item, idx) => (
                                <div key={idx} className={cn("text-xs", idx > 0 && "mt-2 pt-2 border-t border-white/10")}>
                                    <div className="font-bold text-white">{item.subject}</div>
                                    <div className="text-white/70 mt-0.5">
                                        {item.type === "PREDAVANJE" ? "Predavanje" : "Vežbe"} · {item.startTime.slice(0, 5)}–{item.endTime.slice(0, 5)}
                                    </div>
                                    <div className="text-white/50 text-[10px]">Učionica {item.cabinet}</div>
                                </div>
                            ))}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-brand-blue" />
                        </div>
                    )}
                </CellTag>
            );
        }

        return <div className="grid grid-cols-7 gap-3">{cells}</div>;
    };

    return (
        <div className="bg-white rounded-3xl p-8 border-2 border-brand-blue/10 shadow-2xl">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="mt-8 pt-6 border-t border-brand-blue/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-brand-blue/60">Neradni dan</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-brand-blue/10 border border-brand-blue/20" />
                    <span className="text-sm font-medium text-brand-blue/60">Radni dan</span>
                </div>
                {schedule.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-brand-blue/40" />
                        <span className="text-sm font-medium text-brand-blue/60">Ima nastavu</span>
                    </div>
                )}
            </div>
        </div>
    );
};
