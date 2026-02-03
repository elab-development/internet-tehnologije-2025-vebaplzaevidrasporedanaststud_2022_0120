"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";

interface Stats {
    termsCount: number;
    studentsCount: number;
    groupsCount: number;
}

export function DashboardStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/admin/stats");
                if (!response.ok) {
                    throw new Error("Greška pri učitavanju statistike");
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Nepoznata greška");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (error) {
        return <div className="text-red-500">Došlo je do greške: {error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                <div>
                    <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Ukupno termina</p>
                    <h3 className="text-4xl font-serif font-bold text-brand-blue">
                        {loading ? "--" : stats?.termsCount}
                    </h3>
                </div>
            </Card>
            <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                <div>
                    <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Studenti</p>
                    <h3 className="text-4xl font-serif font-bold text-brand-blue">
                        {loading ? "--" : stats?.studentsCount}
                    </h3>
                </div>
            </Card>
            <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                <div>
                    <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Grupe</p>
                    <h3 className="text-4xl font-serif font-bold text-brand-blue">
                        {loading ? "--" : stats?.groupsCount}
                    </h3>
                </div>
            </Card>
        </div>
    );
}
