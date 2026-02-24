"use client";

import { useState, useEffect } from "react";
import { StudentHeader } from "@/components/StudentHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { PageHeading } from "@/components/PageHeading";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AttendanceChart } from "@/components/AttendanceChart";

interface SubjectStat {
    subjectTitle: string;
    presence: number;
    held: number;
    absence: number;
}

interface Profile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    indexNumber: string;
    studyProgram: string;
    yearOfStudy: number;
    pictureUrl: string | null;
    groupName: string | null;
    subjectStats: SubjectStat[];
}

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Editable fields
    const [username, setUsername] = useState("");

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/student/profile");
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setUsername(data.username);
            } else {
                setError(data.error || "Greška pri učitavanju podataka.");
            }
        } catch (_err) {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const res = await fetch("/api/student/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess("Podaci su uspešno izmenjeni.");
                setEditing(false);
                fetchProfile();
            } else {
                setError(data.error || "Greška pri čuvanju podataka.");
            }
        } catch (_err) {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setUsername(profile.username);
        }
        setEditing(false);
        setError("");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
                <StudentHeader activePage="profil" />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-brand-blue/40 font-serif italic animate-pulse">Učitavanje profila...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFCFB] selection:bg-brand-gold/30">
            <StudentHeader activePage="profil" />

            <section className="relative pt-48 pb-20 overflow-hidden">
                {/* Decorative Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl -z-10" />

                <div className="mx-auto max-w-4xl px-6 w-full">
                    <div className="flex flex-col mb-12">
                        <PageHeading
                            title="Moj Profil"
                            subtitle="Pregledajte i promenite korisničko ime."
                        />
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-100 border border-red-200 text-red-800 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-8 p-4 rounded-2xl bg-green-100 border border-green-200 text-green-800 text-sm font-bold text-center">
                            {success}
                        </div>
                    )}

                    {profile && (
                        <div className="space-y-6">
                            {/* Main Info Card */}
                            <Card className="p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-2 w-10 bg-brand-gold rounded-full" />
                                    <h2 className="text-2xl font-bold text-brand-blue">Lični podaci</h2>
                                    {editing && (
                                        <Badge variant="blue" dot>Uređivanje</Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* First Name */}
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Ime</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.firstName}</p>
                                    </div>

                                    {/* Last Name  */}
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Prezime</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.lastName}</p>
                                    </div>

                                    {/* Email  */}
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Email</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.email}</p>
                                    </div>

                                    {/* Username */}
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-brand-blue/[0.03] border border-brand-blue/10 group transition-all hover:bg-brand-blue/[0.05]">
                                        <div>
                                            <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Korisničko ime</p>
                                            {editing ? (
                                                <Input
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Unesite korisničko ime"
                                                    className="w-full md:w-80 bg-white"
                                                />
                                            ) : (
                                                <p className="text-xl font-bold text-brand-blue tracking-tight">{profile.username}</p>
                                            )}
                                        </div>
                                        {!editing && (
                                            <Button
                                                onClick={() => { setEditing(true); setSuccess(""); setError(""); }}
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-brand-blue/20 text-brand-blue font-bold px-4 py-2 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm group-hover:scale-105 active:scale-95 flex items-center gap-2"
                                            >

                                                Promeni
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Actions */}
                                {editing && (
                                    <div className="flex gap-4 mt-8 pt-8 border-t border-brand-blue/10">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            variant="primary"
                                            className="rounded-xl px-8 py-3 font-bold shadow-lg shadow-brand-blue/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:scale-100"
                                        >
                                            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="rounded-xl px-8 py-3 font-bold"
                                        >
                                            Odustani
                                        </Button>
                                    </div>
                                )}
                            </Card>

                            {/* Academic Info Card */}
                            <Card className="p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-2 w-10 bg-brand-gold rounded-full" />
                                    <h2 className="text-2xl font-bold text-brand-blue">Akademski podaci</h2>
                                    <Badge variant="gray">Nije moguće menjati</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Broj indeksa</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.indexNumber}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Studijski program</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.studyProgram}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Godina studija</p>
                                        <p className="text-xl font-bold text-brand-blue">{profile.yearOfStudy}. godina</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-2">Studentska grupa</p>
                                        {profile.groupName ? (
                                            <Badge variant="blue">{profile.groupName}</Badge>
                                        ) : (
                                            <p className="text-brand-blue/40 italic">Nije dodeljena</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                            {/* Attendance Stats Card */}
                            <Card className="p-10 mb-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-2 w-10 bg-brand-gold rounded-full" />
                                    <h2 className="text-2xl font-bold text-brand-blue">Statistika prisustva</h2>
                                    <Badge variant="blue">Do danas</Badge>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-brand-blue/10">
                                                <th className="pb-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest">Predmet</th>
                                                <th className="pb-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest text-center">Prisustva</th>
                                                <th className="pb-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest text-center">Odsustva</th>
                                                <th className="pb-4 text-xs font-bold text-brand-blue/40 uppercase tracking-widest text-center">Ukupno održano</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-blue/5">
                                            {profile.subjectStats && profile.subjectStats.length > 0 ? (
                                                profile.subjectStats.map((stat, idx) => (
                                                    <tr key={idx} className="group hover:bg-brand-blue/[0.01] transition-colors">
                                                        <td className="py-4 font-bold text-brand-blue">{stat.subjectTitle}</td>
                                                        <td className="py-4 text-center">
                                                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg bg-green-50 text-green-700 font-bold text-sm">
                                                                {stat.presence}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-center">
                                                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-sm">
                                                                {stat.absence}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-center font-medium text-brand-blue/40">
                                                            {stat.held}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-10 text-center text-brand-blue/40 italic">
                                                        Nema dostupnih podataka o prisustvu.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Attendance Chart */}
                            <Card className="p-10 mb-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-2 w-10 bg-brand-gold rounded-full" />
                                    <h2 className="text-2xl font-bold text-brand-blue">Vizualizacija prisustva</h2>
                                    <Badge variant="blue">Google Charts</Badge>
                                </div>
                                <AttendanceChart data={profile.subjectStats ?? []} />
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
