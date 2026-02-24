"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { PageHeading } from "@/components/PageHeading";
import { Table } from "@/components/Table";
import { Button } from "@/components/Button";
import { NewHolidayForm } from "@/components/NewHolidayForm";
import { Trash2, Plus, Calendar as CalendarIcon, LayoutGrid, List, RefreshCw } from "lucide-react";

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
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        setError("");
        try {
            const res = await fetch("/api/admin/holidays-sync", { method: "POST" });

            const result = await res.json();
            if (res.ok) {
                alert(result.message);
                fetchHolidays();
            } else {
                setError(result.error || "Greška pri sinhronizaciji.");
            }
        } catch {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setIsSyncing(false);
        }
    };


    const fetchHolidays = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/holidays");
            const result = await res.json();
            if (res.ok) {
                setHolidays(result);
            } else {
                setError(result.error || "Greška pri učitavanju.");
            }
        } catch {
            setError("Greška u povezivanju sa serverom.");
        }
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            fetchHolidays();
        });
    }, [fetchHolidays]);

    const handleToggleDate = (date: Date) => {
        setSelectedDate(date);
        setShowTypeModal(true);
    };

    const handleConfirmType = async (type: string | "DELETE") => {
        if (!selectedDate) return;

        const date = selectedDate;
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

        if (type === "DELETE") {
            if (existingHoliday) {
                try {
                    const res = await fetch(`/api/admin/holidays/${existingHoliday.id}`, {
                        method: "DELETE"
                    });
                    if (res.ok) {
                        setHolidays(holidays.filter(h => h.id !== existingHoliday.id));
                    }
                } catch (err) {
                    console.error("Error deleting holiday:", err);
                }
            }
        } else {
            // Add or Update
            try {
                const res = await fetch("/api/admin/holidays", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: dateStr,
                        type: type
                    })
                });
                if (res.ok) {
                    const result = await res.json();
                    if (existingHoliday) {
                        // Update existing in local state
                        setHolidays(holidays.map(h => h.id === result.id ? result : h));
                    } else {
                        // Add new to local state
                        setHolidays([...holidays, result].sort((a, b) =>
                            new Date(a.date).getTime() - new Date(b.date).getTime()
                        ));
                    }
                    setError("");
                } else {
                    const data = await res.json();
                    setError(data.error || "Greška prilikom čuvanja.");
                }
            } catch (err) {
                console.error("Error saving holiday:", err);
                setError("Greška u povezivanju sa serverom.");
            }
        }
        setShowTypeModal(false);
        setSelectedDate(null);
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
        } catch {
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
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        variant="secondary"
                                        className="flex items-center gap-2"
                                    >
                                        <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                                        {isSyncing ? "Sinhronizacija..." : "Sinhronizuj praznike"}
                                    </Button>
                                    <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                                        <Plus size={18} />
                                        Dodaj neradni dan
                                    </Button>
                                </div>
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
                                                <Badge variant={getBadgeVariant(holiday.type) as "red" | "blue" | "amber" | "gray"}>
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

                    {/* Type Selection Modal */}
                    {showTypeModal && selectedDate && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-blue/20 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white rounded-3xl p-8 border-2 border-brand-blue/10 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                                <h3 className="text-xl font-bold text-brand-blue mb-2">Izaberi tip aktivnosti</h3>
                                <p className="text-brand-blue/60 text-sm mb-6">
                                    Za datum: <span className="font-bold text-brand-blue">{selectedDate.toLocaleDateString("sr-RS")}</span>
                                </p>

                                <div className="grid gap-3 mb-8">
                                    {[
                                        { value: "NERADNI_DAN", label: "Neradni dan", color: "bg-red-50 text-red-600 border-red-100" },
                                        { value: "KOLOKVIJUMSKA_NEDELJA", label: "Kolokvijumska nedelja", color: "bg-blue-50 text-blue-600 border-blue-100" },
                                        { value: "ISPITNI_ROK", label: "Ispitni rok", color: "bg-amber-50 text-amber-600 border-amber-100" },
                                        { value: "BEZ_AKTIVNOSTI", label: "Bez aktivnosti", color: "bg-gray-50 text-gray-600 border-gray-100" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleConfirmType(opt.value)}
                                            className={cn(
                                                "w-full px-5 py-4 rounded-2xl border-2 text-left font-bold transition-all hover:scale-[1.02] active:scale-95",
                                                opt.color
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}

                                    {holidays.some(h => {
                                        const hDate = new Date(h.date);
                                        return hDate.getFullYear() === selectedDate.getFullYear() &&
                                            hDate.getMonth() === selectedDate.getMonth() &&
                                            hDate.getDate() === selectedDate.getDate();
                                    }) && (
                                            <button
                                                onClick={() => handleConfirmType("DELETE")}
                                                className="w-full px-5 py-4 rounded-2xl border-2 border-red-200 text-red-600 font-bold bg-white hover:bg-red-50 transition-all flex items-center justify-center gap-2 mt-2"
                                            >
                                                <Trash2 size={18} />
                                                Obriši postojeće
                                            </button>
                                        )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowTypeModal(false)}
                                        className="px-6 py-2.5 text-brand-blue/40 font-bold hover:text-brand-blue transition-colors"
                                    >
                                        Otkaži
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
