"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Badge } from "@/components/Badge";
import { Subject, Cabinet, StudentGroup } from "@/shared/types";

const DAYS_OF_WEEK = [
    { value: "PONEDELJAK", label: "Ponedeljak" },
    { value: "UTORAK", label: "Utorak" },
    { value: "SREDA", label: "Sreda" },
    { value: "CETVRTAK", label: "Četvrtak" },
    { value: "PETAK", label: "Petak" },
    { value: "SUBOTA", label: "Subota" },
    { value: "NEDELJA", label: "Nedelja" },
];

const SESSION_TYPES = [
    { value: "PREDAVANJE", label: "Predavanje" },
    { value: "VEZBE", label: "Vežbe" },
];

export default function EditTermPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");

    // Form data
    const [formData, setFormData] = useState({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        type: "",
        subjectId: "",
        cabinetId: "",
        groupId: "",
    });

    // Options
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [cabinets, setCabinets] = useState<Cabinet[]>([]);
    const [groups, setGroups] = useState<StudentGroup[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subsRes, cabsRes, grpsRes, termRes] = await Promise.all([
                    fetch("/api/subjects"),
                    fetch("/api/cabinets"),
                    fetch("/api/admin/groups"),
                    fetch(`/api/admin/terms/${id}`)
                ]);

                const [subs, cabs, grps, term] = await Promise.all([
                    subsRes.json(),
                    cabsRes.json(),
                    grpsRes.json(),
                    termRes.json()
                ]);

                if (!termRes.ok) throw new Error(term.error || "Nije moguće dohvatiti termin.");

                setSubjects(subs);
                setCabinets(cabs);
                setGroups(grps);

                setFormData({
                    dayOfWeek: term.dayOfWeek,
                    startTime: term.startTime.slice(0, 5),
                    endTime: term.endTime.slice(0, 5),
                    type: term.type,
                    subjectId: term.subjectId,
                    cabinetId: term.cabinetId,
                    groupId: term.groupId,
                });

            } catch (err) {
                const errorObj = err as Error;
                setError(errorObj.message || "Greška pri učitavanju podataka.");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/terms/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/admin/terms");
                router.refresh();
            } else {
                setError(data.error || "Došlo je do greške.");
            }
        } catch {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-brand-blue/40 font-serif italic animate-pulse">Učitavanje podataka...</p>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <header className="mb-10">
                <Badge variant="blue" dot className="mb-4">
                    Izmena termina
                </Badge>
                <h1 className="text-5xl font-serif font-bold text-brand-blue tracking-tight">
                    Izmeni <span className="text-brand-gold italic">Termin</span>
                </h1>
            </header>

            <Card className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Dan u nedelji"
                            options={DAYS_OF_WEEK}
                            value={formData.dayOfWeek}
                            onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        />
                        <Select
                            label="Tip nastave"
                            options={SESSION_TYPES}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Vreme početka"
                            type="time"
                            required
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                        <Input
                            label="Vreme završetka"
                            type="time"
                            required
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                    </div>

                    <div className="space-y-6">
                        <Select
                            label="Predmet"
                            options={subjects.map(s => ({ value: s.id, label: s.title }))}
                            value={formData.subjectId}
                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Kabinet"
                                options={cabinets.map(c => ({ value: c.id, label: `${c.number} (${c.type})` }))}
                                value={formData.cabinetId}
                                onChange={(e) => setFormData({ ...formData, cabinetId: e.target.value })}
                            />
                            <Select
                                label="Studentska grupa"
                                options={groups.map(g => ({ value: g.id, label: g.name }))}
                                value={formData.groupId}
                                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-blue/5 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-2xl py-4 font-bold"
                            onClick={() => router.back()}
                        >
                            Otkaži
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-[2] rounded-2xl py-4 font-bold bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Čuvanje..." : "Sačuvaj izmene"}
                        </Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}
