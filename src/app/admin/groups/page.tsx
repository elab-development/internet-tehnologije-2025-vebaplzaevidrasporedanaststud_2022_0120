"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { PageHeading } from "@/components/PageHeading";
import { Table } from "@/components/Table";
import { Users } from "lucide-react";

interface Group {
    id: string;
    name: string;
    studyProgram: string;
    yearOfStudy: number;
    alphabetHalf: number;
    studentCount: number;
}

const studyProgramLabels: Record<string, string> = {
    "Informacioni sistemi": "Informacioni sistemi",
    "Menadzment": "Menadžment",
};

export default function AdminGroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch("/api/admin/groups");
                const data = await res.json();
                if (res.ok) {
                    setGroups(data);
                } else {
                    setError(data.error || "Greška pri učitavanju grupa.");
                }
            } catch {
                setError("Greška u povezivanju sa serverom.");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-brand-blue/40 font-serif italic animate-pulse">Učitavanje grupa...</p>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <PageHeading
                    title="Studentske Grupe"
                    subtitle={`Ukupno ${groups.length} definisanih grupa studenata.`}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                    <Users size={16} className="text-brand-blue/50" />
                    <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-wider">
                        Pregled svih grupa
                    </span>
                </div>
            </header>

            {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center">
                    {error}
                </div>
            )}

            <Card className="overflow-hidden">
                <Table headers={["Naziv grupe", "Studijski program", "Godina studija", "Polovina abecede", "Broj studenata"]}>
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <tr
                                key={group.id}
                                className="group border-b border-brand-blue/5 last:border-0 hover:bg-brand-blue/[0.02] transition-colors"
                            >
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-brand-blue/5 flex items-center justify-center">
                                            <span className="text-xs font-bold text-brand-blue">
                                                {group.name.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="font-bold text-brand-blue text-lg">
                                            {group.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <Badge variant="blue">
                                        {studyProgramLabels[group.studyProgram] ?? group.studyProgram}
                                    </Badge>
                                </td>
                                <td className="py-5 px-6">
                                    <span className="font-bold text-brand-blue">
                                        {group.yearOfStudy}. godina
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-brand-blue/60 font-medium">
                                    {group.alphabetHalf === 1 ? "A – M" : "N – Ž"}
                                </td>
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-brand-blue/40" />
                                        <span className="font-bold text-brand-blue">
                                            {group.studentCount}
                                        </span>
                                        <span className="text-brand-blue/40 text-sm font-medium">
                                            {Number(group.studentCount) === 1 ? "student" : "studenata"}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-brand-blue/40 font-medium italic">
                                Nema definisanih studentskih grupa.
                            </td>
                        </tr>
                    )}
                </Table>
            </Card>
        </main>
    );
}
