"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";

function EmptyState({ message }: { message: string }) {
    return (
        <div className="min-h-[400px] text-center border border-brand-blue/5 rounded-[2rem] bg-white/50 backdrop-blur-sm flex items-center justify-center w-full">
            <p className="text-brand-blue/30 font-serif italic text-xl tracking-tight px-12 leading-relaxed max-w-sm">
                {message}
            </p>
        </div>
    );
}

interface Cabinet {
    id: string;
    number: string;
    capacity: number;
    type: string;
}

interface Subject {
    id: string;
    title: string;
    espb: number;
    description: string;
}

export function HomeDataGrid() {
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [cabRes, subRes] = await Promise.all([
                fetch("/api/cabinets"),
                fetch("/api/subjects")
            ]);

            if (!cabRes.ok || !subRes.ok) throw new Error("Greška pri učitavanju podataka.");

            const [cabData, subData] = await Promise.all([
                cabRes.json(),
                subRes.json()
            ]);

            setCabinets(cabData);
            setSubjects(subData);
            setHasLoaded(true);
        } catch (err) {
            setError("Nije moguće učitati podatke. Proverite vezu.");
        } finally {
            setLoading(false);
        }
    };

    if (!hasLoaded && !loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center border-t border-brand-blue/5">
                <p className="text-brand-blue/60 font-medium mb-8 text-center max-w-md">
                    Otkrijte listu dostupnih predmeta i kabineta na Fakultetu organizacionih nauka.
                </p>
                <Button
                    onClick={fetchData}
                    variant="primary"
                    className="px-12 py-6 rounded-2xl text-lg font-bold shadow-xl shadow-brand-blue/10 hover:scale-105 transition-all"
                >
                    Prikaži podatke
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="py-40 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                    <p className="text-brand-blue/40 font-bold uppercase tracking-widest text-xs">Učitavanje...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="py-20 border-t border-brand-blue/5 animate-in fade-in duration-700">
            <div className="mx-auto max-w-7xl px-6">
                {error && (
                    <div className="mb-12 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold text-center">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Subjects - Main Column */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-4xl font-serif font-bold text-brand-blue">Predmeti</h2>
                            <div className="h-[1px] flex-1 bg-brand-blue/10" />
                            <span className="font-mono text-sm text-brand-gold">{subjects.length} predmeta</span>
                        </div>

                        {subjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {subjects.map((subject) => (
                                    <Card key={subject.id} className="group p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/5 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <Badge variant="blue">
                                                ESPB: {subject.espb}
                                            </Badge>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-brand-blue mb-3 group-hover:text-brand-gold transition-colors leading-tight">
                                            {subject.title}
                                        </h3>
                                        <p className="text-brand-blue/50 text-sm leading-relaxed">
                                            {subject.description}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="Trenutno nema dostupnih predmeta." />
                        )}
                    </div>

                    {/* Cabinets - Sidebar Column */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="sticky top-32 flex flex-col">
                            <div className="flex items-center gap-4 mb-12">
                                <h2 className="text-4xl font-serif font-bold text-brand-blue">Kabineti</h2>
                                <div className="h-[1px] flex-1 bg-brand-blue/10" />
                                <span className="font-mono text-sm text-brand-gold">{cabinets.length} kabineta</span>
                            </div>

                            {cabinets.length > 0 ? (
                                <div className="space-y-4">
                                    {cabinets.map((cabinet) => (
                                        <Card key={cabinet.id} variant="primary" className="p-6 group hover:bg-brand-gold transition-colors rounded-2xl">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1 group-hover:text-brand-blue/70">{cabinet.type}</p>
                                                    <h4 className="text-3xl font-serif font-bold">{cabinet.number}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold">{cabinet.capacity}</p>
                                                    <p className="text-[8px] font-bold uppercase text-white/40 group-hover:text-brand-blue/50">Mesta</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="Nema dostupnih kabineta." />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
