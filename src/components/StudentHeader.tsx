"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
        } catch (err) {
            alert("Greška u povezivanju sa serverom.");
        }
    };

    const linkClass = (page: string) =>
        page === activePage
            ? "text-sm font-bold text-brand-gold transition-colors"
            : "text-sm font-bold text-brand-blue hover:text-brand-gold transition-colors";

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
                    <button className={linkClass("kalendar")}>Kalendar</button>
                    <button className={linkClass("profil")}>Profil</button>
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
