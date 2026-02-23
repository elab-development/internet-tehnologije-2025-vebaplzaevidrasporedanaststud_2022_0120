"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AdminHeaderProps = object;

export function AdminHeader() {
    const router = useRouter();
    const pathname = usePathname();

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

    const linkClass = (path: string) =>
        cn(
            "text-sm font-bold transition-colors",
            pathname.startsWith(path) ? "text-brand-gold" : "text-brand-blue hover:text-brand-gold"
        );

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <nav className="glass-morphism border border-brand-blue/20 rounded-2xl px-8 py-4 flex items-center justify-between shadow-lg shadow-brand-blue/5">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-brand-gold" />
                    <span className="text-xl font-serif font-bold text-brand-blue tracking-tight">
                        FON Admin
                    </span>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                        Dashboard
                    </Link>
                    <Link href="/admin/terms" className={linkClass("/admin/terms")}>
                        Termini
                    </Link>
                    <Link href="/admin/holidays" className={linkClass("/admin/holidays")}>
                        Neradni dani (Kalendar)
                    </Link>
                    <Link href="/admin/groups" className={linkClass("/admin/groups")}>
                        Grupe
                    </Link>
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
