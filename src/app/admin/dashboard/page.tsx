import { Badge } from "@/components/Badge";
import { DashboardStats } from "@/components/DashboardStats";

export default async function AdminDashboard() {
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

            <DashboardStats />
        </main>
    );
}
