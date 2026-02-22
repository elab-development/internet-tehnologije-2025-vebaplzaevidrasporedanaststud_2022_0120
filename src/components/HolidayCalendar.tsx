"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HolidayCalendarProps {
    holidays: Array<{ date: string; type: string }>;
    onToggleDate: (date: Date) => void;
}

export const HolidayCalendar: React.FC<HolidayCalendarProps> = ({ holidays, onToggleDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

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

            const isHoliday = holidays.some((h: { date: string }) => {
                const hDate = new Date(h.date);
                const hYYYY = hDate.getFullYear();
                const hMM = String(hDate.getMonth() + 1).padStart(2, '0');
                const hDD = String(hDate.getDate()).padStart(2, '0');
                const hDateStr = `${hYYYY}-${hMM}-${hDD}`;
                return hDateStr === dateStr;
            });

            cells.push(
                <button
                    key={day}
                    onClick={() => onToggleDate(date)}
                    className={cn(
                        "h-16 md:h-20 flex flex-col items-center justify-center rounded-2xl transition-all relative group overflow-hidden",
                        isHoliday
                            ? "bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100"
                            : "bg-white border-2 border-transparent hover:border-brand-blue/10 hover:bg-brand-blue/[0.02] text-brand-blue/80"
                    )}
                >
                    <span className="text-lg font-bold z-10">{day}</span>
                    {isHoliday && (
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
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
            </div>
        </div>
    );
};
