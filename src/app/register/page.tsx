"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        indexNumber: "",
        studyProgram: "Informacioni sistemi",
        yearOfStudy: 1
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    yearOfStudy: Number(formData.yearOfStudy)
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to login on success
                router.push("/login?registered=success");
            } else {
                setError(data.error || "Registracija nije uspela.");
            }
        } catch {
            setError("Došlo je do greške na mreži.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-brand-blue/[0.03] to-transparent -z-10" />

            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="h-2 w-2 rounded-full bg-brand-gold group-hover:scale-150 transition-transform" />
                        <span className="text-sm font-bold text-brand-blue/40 tracking-widest uppercase">FON raspored</span>
                    </Link>
                    <h1 className="text-4xl font-serif font-bold text-brand-blue mb-2">Kreiranje studentskog naloga</h1>
                    <p className="text-brand-blue/50 text-sm font-medium">Nakon registracije biće vam dodeljena grupa na osnovu vaših podataka.</p>
                </div>

                <Card className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-100 border border-red-200 text-red-800 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Data */}
                            <div className="space-y-4">
                                <Input
                                    label="Ime"
                                    required
                                    placeholder="Milovan"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                <Input
                                    label="Prezime"
                                    required
                                    placeholder="Anić"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                                <Input
                                    label="Korisničko ime"
                                    required
                                    placeholder="milovan_anic"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            {/* Account & Studies */}
                            <div className="space-y-4">
                                <Input
                                    label="Email adresa"
                                    type="email"
                                    required
                                    placeholder="student@fon.bg.ac.rs"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Input
                                    label="Lozinka"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <Input
                                    label="Broj indeksa"
                                    required
                                    placeholder="XXXX/YYYY (npr. 2022/0120)"
                                    value={formData.indexNumber}
                                    onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-blue/5">
                            <Select
                                label="Studijski program"
                                value={formData.studyProgram}
                                onChange={(e) => setFormData({ ...formData, studyProgram: e.target.value })}
                                options={[
                                    { value: "Informacioni sistemi", label: "Informacioni sistemi" },
                                    { value: "Menadzment", label: "Menadzment" }
                                ]}
                            />
                            <Select
                                label="Godina studija"
                                value={formData.yearOfStudy}
                                onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                                options={[
                                    { value: 1, label: "1. godina" },
                                    { value: 2, label: "2. godina" },
                                    { value: 3, label: "3. godina" },
                                    { value: 4, label: "4. godina" }
                                ]}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 mt-4 rounded-2xl bg-brand-blue text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Kreiranje naloga..." : "Registruj se"}
                        </Button>
                    </form>

                    <footer className="mt-8 text-center pt-8 border-t border-brand-blue/5">
                        <p className="text-sm text-brand-blue/40 font-medium">
                            Već imate nalog?{" "}
                            <Link href="/login" className="text-brand-gold font-bold hover:underline decoration-2 underline-offset-4">
                                Prijavite se ovde
                            </Link>
                        </p>
                    </footer>
                </Card>
            </div>
        </main>
    );
}
