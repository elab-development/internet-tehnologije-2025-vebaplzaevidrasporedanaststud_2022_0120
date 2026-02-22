"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { PageHeading } from "@/components/PageHeading";
import { Table } from "@/components/Table";
import { Button } from "@/components/Button";
import { NewHolidayForm } from "@/components/NewHolidayForm";
import { Trash2, Plus, Calendar as CalendarIcon, LayoutGrid, List } from "lucide-react";
import { HolidayCalendar } from "@/components/HolidayCalendar";
import { cn } from "@/lib/utils";

interface Holiday {
    id: string;
    date: string;
    type: string;
    calendar: {
        academicYear: string;
    };
}

export default function HolidaysPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

    const fetchHolidays = async () => {
        try {
            const res = await fetch("/api/admin/holidays");
            const result = await res.json();
            if (res.ok) {
                setHolidays(result);
            } else {
                setError(result.error || "Greška pri učitavanju.");
            }
        } catch (err) {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleToggleDate = async (date: Date) => {
        // Fix: Use local date components to avoid timezone shifts
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const existingHoliday = holidays.find((h: Holiday) => {
            const hDate = new Date(h.date);
            const hYYYY = hDate.getFullYear();
            const hMM = String(hDate.getMonth() + 1).padStart(2, '0');
            const hDD = String(hDate.getDate()).padStart(2, '0');
            const hDateStr = `${hYYYY}-${hMM}-${hDD}`;
            return hDateStr === dateStr;
        });

        if (existingHoliday) {
            // Delete
            try {
                const res = await fetch(`/api/admin/holidays/${existingHoliday.id}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setHolidays(holidays.filter(h => h.id !== existingHoliday.id));
                }
            } catch (err) {
                console.error("Error toggling holiday:", err);
            }
        } else {
            // Add
            try {
                const res = await fetch("/api/admin/holidays", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: dateStr,
                        type: "NERADNI_DAN"
                    })
                });
                if (res.ok) {
                    const newHoliday = await res.json();
                    setHolidays([...holidays, newHoliday].sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    ));
                    setError(""); // Clear any previous error
                } else {
                    const data = await res.json();
                    setError(data.error || "Greška prilikom dodavanja praznika.");
                }
            } catch (err) {
                console.error("Error toggling holiday:", err);
                setError("Greška u povezivanju sa serverom.");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Da li ste sigurni da želite da obrišete ovaj neradni dan?")) return;

        try {
            const res = await fetch(`/api/admin/holidays/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setHolidays(holidays.filter((h: Holiday) => h.id !== id));
            } else {
                alert("Greška prilikom brisanja.");
            }
        } catch (err) {
            alert("Greška u povezivanju sa serverom.");
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("sr-RS", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case "NERADNI_DAN": return "red";
            case "KOLOKVIJUMSKA_NEDELJA": return "blue";
            case "ISPITNI_ROK": return "amber";
            default: return "gray";
        }
    };

    return (
        <main className="min-h-screen">
            <section className="relative pt-12 pb-20 overflow-hidden min-h-screen">
                <div className="mx-auto max-w-6xl px-6 w-full">
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <PageHeading
                            title="Neradni Dani (Kalendar)"
                            subtitle="Upravljajte praznicima i akademskim kalendarom."
                        />
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider">
                                    Vikendi su podrazumevano neradni
                                </span>
                            </div>
                            <div className="flex bg-brand-blue/5 p-1 rounded-2xl mr-4">
                                <button
                                    onClick={() => setViewMode("calendar")}
                                    className={cn(
                                        "p-2 rounded-xl transition-all",
                                        viewMode === "calendar" ? "bg-white shadow-sm text-brand-blue" : "text-brand-blue/40 hover:text-brand-blue/60"
                                    )}
                                    title="Kalendar"
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "p-2 rounded-xl transition-all",
                                        viewMode === "list" ? "bg-white shadow-sm text-brand-blue" : "text-brand-blue/40 hover:text-brand-blue/60"
                                    )}
                                    title="Lista"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                            {!showForm && (
                                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                                    <Plus size={18} />
                                    Dodaj neradni dan
                                </Button>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <Card className="p-8 mb-12 border-2 border-brand-gold/30">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-2 w-10 bg-brand-gold rounded-full" />
                                <h2 className="text-2xl font-bold text-brand-blue">Novi unos</h2>
                            </div>
                            <NewHolidayForm
                                onSuccess={() => {
                                    setShowForm(false);
                                    fetchHolidays();
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        </Card>
                    )}

                    {viewMode === "calendar" ? (
                        <div>
                            <HolidayCalendar
                                holidays={holidays}
                                onToggleDate={handleToggleDate}
                            />
                        </div>
                    ) : (
                        <Card className="overflow-hidden">
                            <Table headers={["Datum", "Tip", "Akademska godina", "Akcije"]}>
                                {holidays.length > 0 ? (
                                    holidays.map((holiday: Holiday) => (
                                        <tr key={holiday.id} className="group border-b border-brand-blue/5 last:border-0 hover:bg-brand-blue/[0.02] transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <CalendarIcon size={16} className="text-brand-blue/40" />
                                                    <span className="font-bold text-brand-blue">
                                                        {formatDate(holiday.date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <Badge variant={getBadgeVariant(holiday.type) as any}>
                                                    {holiday.type.replace(/_/g, " ")}
                                                </Badge>
                                            </td>
                                            <td className="py-5 px-6 text-brand-blue/60 font-medium">
                                                {holiday.calendar?.academicYear || "..."}
                                            </td>
                                            <td className="py-5 px-6">
                                                <button
                                                    onClick={() => handleDelete(holiday.id)}
                                                    className="p-2 text-brand-blue/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Obriši"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-brand-blue/40 font-medium italic">
                                            Nema unetih neradnih dana.
                                        </td>
                                    </tr>
                                )}
                            </Table>
                        </Card>
                    )}
                </div>
            </section>
        </main>
    );
}
