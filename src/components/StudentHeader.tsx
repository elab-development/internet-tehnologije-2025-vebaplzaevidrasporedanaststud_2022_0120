"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface StudentHeaderProps {
    activePage: "prisustvo" | "raspored" | "kalendar" | "profil";
}

export function StudentHeader({ activePage }: StudentHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                router.push("/login");
            } else {
                alert("Greška prilikom odjavljivanja.");
            }
        } catch (_err) {
            alert("Greška u povezivanju sa serverom.");
        }
    };

    const linkClass = (page: string) =>
        cn(
            "text-sm font-bold transition-colors",
            page === activePage ? "text-brand-gold" : "text-brand-blue hover:text-brand-gold"
        );

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <nav className="glass-morphism border border-brand-blue/20 rounded-2xl px-8 py-4 flex items-center justify-between shadow-lg shadow-brand-blue/5">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-brand-gold" />
                    <span className="text-xl font-serif font-bold text-brand-blue tracking-tight">
                        FON raspored
                    </span>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="/student/dashboard" className={linkClass("prisustvo")}>
                        Prisustvo
                    </Link>
                    <Link href="/student/schedule" className={linkClass("raspored")}>
                        Raspored
                    </Link>
                    <Link href="/student/calendar" className={linkClass("kalendar")}>Kalendar</Link>
                    <Link href="/student/profile" className={linkClass("profil")}>Profil</Link>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                        Odjavi se
                    </button>
                </div>
            </nav>
        </div>
    );
}
