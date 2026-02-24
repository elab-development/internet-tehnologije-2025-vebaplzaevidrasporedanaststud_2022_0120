"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Term } from "@/shared/types";

export default function AdminTermsPage() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTerms = async () => {
        try {
            const res = await fetch("/api/admin/terms");
            const data = await res.json();
            if (res.ok) {
                setTerms(data);
            } else {
                setError(data.error || "Greška pri učitavanju termina.");
            }
        } catch {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Da li ste sigurni da želite da obrišete ovaj termin?")) return;

        try {
            const res = await fetch(`/api/admin/terms/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTerms(terms.filter(t => t.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Greška pri brisanju.");
            }
        } catch {
            alert("Greška u povezivanju sa serverom.");
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-brand-blue/40 font-serif italic animate-pulse">Učitavanje termina...</p>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-brand-blue tracking-tight">
                        Svi <span className="text-brand-gold italic">Termini</span>
                    </h1>
                    <p className="mt-2 text-brand-blue/60 font-medium">
                        Ukupno {terms.length} planiranih termina nastave.
                    </p>
                </div>
                <Link href="/admin/terms/new">
                    <Button variant="primary" className="rounded-xl px-8 py-4 font-bold shadow-lg shadow-brand-blue/10 hover:scale-105 active:scale-95 transition-all">
                        + Novi termin
                    </Button>
                </Link>
            </header>

            {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {terms.length > 0 ? (
                    terms.map((term) => (
                        <Card key={term.id} className="p-8 group hover:border-brand-gold/30 transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
                                {/* Time and Day */}
                                <div>
                                    <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">{term.dayOfWeek}</p>
                                    <h4 className="text-2xl font-bold text-brand-blue">
                                        {term.startTime.slice(0, 5)} - {term.endTime.slice(0, 5)}
                                    </h4>
                                </div>

                                {/* Subject */}
                                <div className="lg:col-span-2">
                                    <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Predmet</p>
                                    <h4 className="text-xl font-serif font-bold text-brand-blue group-hover:text-brand-gold transition-colors">
                                        {term.subject}
                                    </h4>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="blue">{term.type}</Badge>
                                    </div>
                                </div>

                                {/* Cabinet & Group */}
                                <div>
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Kabinet</p>
                                        <p className="text-lg font-bold text-brand-blue">{term.cabinet}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Grupa</p>
                                        <p className="text-lg font-bold text-brand-blue">{term.group}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <Link href={`/admin/terms/${term.id}/edit`}>
                                        <Button variant="outline" size="sm" className="rounded-xl">Izmeni</Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(term.id)}
                                    >
                                        Obriši
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center border-dashed border-2">
                        <p className="text-brand-blue/30 font-serif italic text-xl">Nema definisanih termina.</p>
                    </Card>
                )}
            </div>
        </main>
    );
}
