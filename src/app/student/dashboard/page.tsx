"use client";

import Link from "next/link";
import { Button } from "@/components/Button";

export default function StudentDashboard() {
    // test podaci
    const currentTerm = {
        exists: true,
        subject: "Internet tehnologije",
        type: "PREDAVANJE",
        time: "10:00 - 12:00",
        cabinet: "Amfiteatar 1",
        dayOfWeek: "SREDA"
    };

    return (
        <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            {/* Fixed Navigation Header */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
                <nav className="glass-morphism border border-brand-blue/20 rounded-2xl px-8 py-4 flex items-center justify-between shadow-lg shadow-brand-blue/5">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full bg-brand-gold" />
                        <span className="text-xl font-serif font-bold text-brand-blue tracking-tight">FON raspored</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link href="/student/dashboard" className="text-sm font-bold text-brand-gold transition-colors">
                            Prisustvo
                        </Link>
                        <button className="text-sm font-bold text-brand-blue hover:text-brand-gold transition-colors">
                            Raspored
                        </button>
                        <button className="text-sm font-bold text-brand-blue hover:text-brand-gold transition-colors">
                            Kalendar
                        </button>
                        <button className="text-sm font-bold text-brand-blue hover:text-brand-gold transition-colors">
                            Profil
                        </button>
                        <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                            Odjavi se
                        </button>
                    </div>
                </nav>
            </div>

            {/* Hero Section - Trenutni Termin */}
            <section className="relative pt-48 pb-20 overflow-hidden min-h-screen flex items-center">
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mx-auto max-w-4xl px-6 w-full">
                    {currentTerm.exists ? (
                        <div className="glass-morphism border border-brand-blue/20 rounded-[3rem] p-12 shadow-2xl shadow-brand-blue/10 bg-white/40">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-8">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-700 uppercase tracking-widest">
                                    Termin u toku
                                </span>
                            </div>

                            {/* Term Details */}
                            <div className="space-y-6 mb-10">
                                <div>
                                    <h1 className="text-5xl font-serif font-bold text-brand-blue mb-2">
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
                                            {currentTerm.time}
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
                                variant="primary"
                                className="w-full py-5 rounded-2xl bg-brand-blue text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-blue/20"
                            >
                                Prijavi se na termin
                            </Button>
                        </div>
                    ) : (
                        <div className="glass-morphism border border-brand-blue/20 rounded-[3rem] p-12 shadow-2xl shadow-brand-blue/10 bg-white/40 text-center">
                            {/* Empty State */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8">
                                <div className="h-2 w-2 rounded-full bg-gray-400" />
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                                    Nema aktivnih termina
                                </span>
                            </div>

                            <div className="max-w-md mx-auto space-y-4">
                                <h2 className="text-4xl font-serif font-bold text-brand-blue">
                                    Trenutno nema termina
                                </h2>
                                <p className="text-brand-blue/60 font-medium leading-relaxed">
                                    Prijavljivanje na termin je trenutno nedostupno.
                                    Proverite svoj raspored za nadolazeće termine.
                                </p>
                            </div>

                            <Button
                                variant="primary"
                                disabled
                                className="w-full py-5 rounded-2xl bg-brand-blue/30 text-white font-bold text-lg mt-10 cursor-not-allowed opacity-50"
                            >
                                Prijavi se na termin
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
