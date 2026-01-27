"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { StudentHeader } from "@/components/StudentHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { PageHeading } from "@/components/PageHeading";

export default function StudentDashboard() {
    const [data, setData] = useState<{ exists: boolean; term?: any; isCheckedIn?: boolean } | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCurrentTerm = async () => {
        try {
            const res = await fetch("/api/student/current-term");
            const result = await res.json();
            if (res.ok) {
                setData(result);
            } else {
                setError(result.error || "Greška pri učitavanju termina.");
            }
        } catch (err) {
            setError("Greška u povezivanju sa serverom.");
        }
    };

    useEffect(() => {
        fetchCurrentTerm();
    }, []);

    const handleCheckIn = async () => {
        if (!data?.term?.id) return;
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/student/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ termId: data.term.id })
            });
            const result = await res.json();

            if (res.ok) {
                setSuccess("Uspešno ste se prijavili na termin!");
                setData(prev => prev ? { ...prev, isCheckedIn: true } : null);
            } else {
                setError(result.error || "Greška prilikom prijave.");
            }
        } catch (err) {
            setError("Greška u povezivanju sa serverom.");
        }
    };

    const currentTerm = data?.term;
    const exists = data?.exists;
    const isCheckedIn = data?.isCheckedIn;

    return (
        <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            <StudentHeader activePage="prisustvo" />

            {/* Hero Section - Trenutni Termin */}
            <section className="relative pt-48 pb-20 overflow-hidden min-h-screen flex items-center">
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mx-auto max-w-4xl px-6 w-full">
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-8 p-4 rounded-2xl bg-green-100 border border-green-200 text-green-800 text-sm font-bold text-center">
                            {success}
                        </div>
                    )}

                    {exists ? (
                        <Card className="p-12">
                            {/* Status Badge */}
                            <Badge
                                variant={isCheckedIn ? "blue" : "green"}
                                dot
                                className="mb-8"
                            >
                                {isCheckedIn ? 'Prisustvo zabeleženo' : 'Termin u toku'}
                            </Badge>

                            {/* Term Details */}
                            <div className="space-y-6 mb-10">
                                <div>
                                    <h1 className="text-5xl font-serif font-bold text-brand-blue mb-2 text-balance leading-tight">
                                        {currentTerm.subject}
                                    </h1>
                                    <div className="flex items-center gap-3 text-brand-blue/60">
                                        <span className="px-3 py-1 rounded-lg bg-brand-blue/5 text-sm font-bold uppercase tracking-wider">
                                            {currentTerm.type}
                                        </span>
                                        <span className="text-sm font-medium">{currentTerm.dayOfWeek}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-brand-blue/10">
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">
                                            Vreme
                                        </p>
                                        <p className="text-2xl font-bold text-brand-blue">
                                            {currentTerm.startTime.slice(0, 5)} - {currentTerm.endTime.slice(0, 5)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">
                                            Učionica
                                        </p>
                                        <p className="text-2xl font-bold text-brand-blue">
                                            {currentTerm.cabinet}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Button */}
                            <Button
                                onClick={handleCheckIn}
                                disabled={isCheckedIn}
                                variant={isCheckedIn ? "secondary" : "primary"}
                                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg ${isCheckedIn
                                    ? 'bg-gray-200 text-gray-600 cursor-default'
                                    : 'bg-brand-blue text-white hover:scale-[1.02] active:scale-[0.98] shadow-brand-blue/20'
                                    }`}
                            >
                                {isCheckedIn ? 'Već ste prijavljeni' : 'Prijavi se na termin'}
                            </Button>
                        </Card>
                    ) : (
                        <Card className="p-12 text-center">
                            {/* Empty State */}
                            <Badge variant="gray" dot className="mb-8">
                                Nema aktivnih termina
                            </Badge>

                            <div className="max-w-md mx-auto space-y-4">
                                <h2 className="text-4xl font-serif font-bold text-brand-blue">
                                    Trenutno nema termina
                                </h2>
                                <p className="text-brand-blue/60 font-medium leading-relaxed">
                                    Prijavljivanje na termin je trenutno nedostupno.
                                    Proverite svoj raspored za nadolazeće termine.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </section>
        </main>
    );
}
