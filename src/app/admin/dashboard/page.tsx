"use client";

import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";

export default function AdminDashboard() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <header className="mb-12">
                <Badge variant="blue" dot className="mb-4">
                    Admin Panel
                </Badge>
                <h1 className="text-6xl font-serif font-bold text-brand-blue tracking-tight">
                    Dobrodošli nazad, <span className="text-brand-gold italic">Admin!</span>
                </h1>
                <p className="mt-4 text-xl text-brand-blue/60 font-medium max-w-2xl leading-relaxed">
                    Upravljajte rasporedom nastave, neradnim danima i pratite statistiku korišćenja sistema.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats cards will go here later */}
                <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                    <div>
                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Ukupno termina</p>
                        <h3 className="text-4xl font-serif font-bold text-brand-blue">--</h3>
                    </div>
                </Card>
                <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                    <div>
                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Studenti</p>
                        <h3 className="text-4xl font-serif font-bold text-brand-blue">--</h3>
                    </div>
                </Card>
                <Card className="p-8 border-brand-blue/5 bg-white hover:border-brand-gold/30 transition-all flex flex-col justify-between h-48">
                    <div>
                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-1">Grupe</p>
                        <h3 className="text-4xl font-serif font-bold text-brand-blue">--</h3>
                    </div>
                </Card>
            </div>
        </main>
    );
}
