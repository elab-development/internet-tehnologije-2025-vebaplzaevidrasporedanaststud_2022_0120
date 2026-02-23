"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

interface NewHolidayFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function NewHolidayForm({ onSuccess, onCancel }: NewHolidayFormProps) {
    const [date, setDate] = useState("");
    const [type, setType] = useState("NERADNI_DAN");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, type })
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.error || "Greška prilikom čuvanja.");
            }
        } catch (_err) {
            setError("Greška u povezivanju sa serverom.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Datum"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <Select
                    label="Tip neradnog dana"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    options={[
                        { value: "NERADNI_DAN", label: "Neradni dan" },
                        { value: "KOLOKVIJUMSKA_NEDELJA", label: "Kolokvijumska nedelja" },
                        { value: "ISPITNI_ROK", label: "Ispitni rok" },
                        { value: "BEZ_AKTIVNOSTI", label: "Bez aktivnosti" },
                    ]}
                />
            </div>

            {error && (
                <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Otkaži
                </Button>
                <Button type="submit" loading={loading}>
                    Sačuvaj
                </Button>
            </div>
        </form>
    );
}
