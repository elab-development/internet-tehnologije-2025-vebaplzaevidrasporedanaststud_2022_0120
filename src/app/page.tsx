import Link from "next/link";
import { Button } from "@/components/Button";
import { HomeDataGrid } from "@/components/HomeDataGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
      {/* Navigation - Framed and Centered */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <nav className="glass-morphism border border-brand-blue/20 rounded-2xl px-8 py-4 flex items-center justify-between shadow-lg shadow-brand-blue/5">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-brand-gold" />
            <span className="text-xl font-serif font-bold text-brand-blue tracking-tight">FON raspored</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-bold text-brand-blue hover:text-brand-gold transition-colors">
              Prijavi se
            </Link>
            <Link href="/register">
              <Button variant="primary" className="rounded-xl bg-brand-blue px-6 text-sm font-bold hover:scale-105 active:scale-95 transition-all">
                Registracija
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] text-brand-blue mb-10">
              Dobrodošli na <span className="text-brand-gold italic">FON!</span>
            </h1>
            <p className="text-xl text-brand-blue/70 leading-relaxed font-medium">
              Centralizovana platforma za studente FON-a. <br />
              Pratite termine, evidentirajte svoje prisustvo i još mnogo toga.
            </p>
          </div>
        </div>
      </section>

      {/* Client-Side Data Grid */}
      <HomeDataGrid />

      {/* Simplified Footer */}
      <footer className="py-20 border-t border-brand-blue/5 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-brand-blue font-serif font-bold text-4xl tracking-tighter">FON</span>
            <p className="text-xs font-medium text-brand-blue/30">© 2025 Fakultet organizacionih nauka</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
