import Link from "next/link";
import { Button } from "@/components/Button";

// za prazna polja
function EmptyState({ message }: { message: string }) {
  return (
    <div className="min-h-[400px] text-center border border-brand-blue/5 rounded-[2rem] bg-white/50 backdrop-blur-sm flex items-center justify-center w-full">
      <p className="text-brand-blue/30 font-serif italic text-xl tracking-tight px-12 leading-relaxed max-w-sm">
        {message}
      </p>
    </div>
  );
}

async function getCabinets() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/api/cabinets`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

async function getSubjects() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/api/subjects`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

export default async function HomePage() {
  const cabinets = await getCabinets();
  const subjects = await getSubjects();

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

      {/* Grid Content */}
      <section className="py-20 border-t border-brand-blue/5">
        <div className="mx-auto max-w-7xl px-6">
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
                  {subjects.map((subject: any) => (
                    <div key={subject.id} className="group p-8 rounded-3xl border border-brand-blue/5 bg-white hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/5 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-10 px-3 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold whitespace-nowrap">
                          ESPB: {subject.espb}
                        </div>

                      </div>
                      <h3 className="text-2xl font-serif font-bold text-brand-blue mb-3 group-hover:text-brand-gold transition-colors leading-tight">
                        {subject.title}
                      </h3>
                      <p className="text-brand-blue/50 text-sm leading-relaxed">
                        {subject.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="Trenutno nema dostupnih predmeta u bazi podataka." />
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
                    {cabinets.map((cabinet: any) => (
                      <div key={cabinet.id} className="p-6 rounded-2xl bg-brand-blue text-white group hover:bg-brand-gold transition-colors border border-transparent shadow-sm">
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
                      </div>
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
