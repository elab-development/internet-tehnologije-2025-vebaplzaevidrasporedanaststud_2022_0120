"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "success";
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect based on role
                if (data.user.role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/student/dashboard");
                }
                router.refresh();
            } else {
                setError(data.error || "Prijava nije uspela.");
            }
        } catch {
            setError("Došlo je do greške na mreži.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="h-2 w-2 rounded-full bg-brand-gold group-hover:scale-150 transition-transform" />
                        <span className="text-sm font-bold text-brand-blue/40 tracking-widest uppercase">FON raspored</span>
                    </Link>
                    <h1 className="text-5xl font-serif font-bold text-brand-blue mb-4">Prijavi se</h1>
                    <p className="text-brand-blue/50 font-medium">Unesite svoje podatke za pristup portalu.</p>
                </div>

                <Card className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistered && !error && (
                            <div className="p-4 rounded-2xl bg-green-100 border border-green-200 text-green-800 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                                Uspešno ste se registrovali! Prijavite se sada.
                            </div>
                        )}
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Korisničko ime"
                            type="text"
                            required
                            placeholder="Unesite korisničko ime"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <Input
                            label="Lozinka"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 rounded-2xl bg-brand-blue text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            disabled={loading}
                        >
                            {loading ? "Prijava..." : "Pristupite portalu"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-brand-blue/5">
                        <p className="text-sm text-brand-blue/40 font-medium">
                            Nemate nalog?{" "}
                            <Link href="/register" className="text-brand-gold font-bold hover:underline decoration-2 underline-offset-4">
                                Registrujte se ovde
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6" />}>
            <LoginContent />
        </Suspense>
    );
}
