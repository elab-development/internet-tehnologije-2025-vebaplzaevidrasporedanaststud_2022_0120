"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

interface QuoteData {
    q: string;
    a: string;
    h: string;
}

export function QuoteSection() {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchQuote() {
            try {
                const res = await fetch("/api/quotes");

                if (!res.ok) {
                    // Optionally, handle specific error statuses here
                    return;
                }

                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setQuote(data[0]);
                }

            } catch (error) {
                console.error("Error fetching quote:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuote();
    }, []);

    if (loading) return (
        <div className="w-full h-24 animate-pulse bg-brand-blue/5 rounded-2xl mb-8" />
    );

    if (!quote) return null;

    return (
        <div className="relative mb-12 p-8 rounded-3xl bg-white border border-brand-blue/10 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            {/* Decorative Icon */}
            <div className="absolute top-[-20px] left-[-20px] p-10 bg-brand-gold/5 rounded-full -z-0" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <Quote className="text-brand-gold mb-4 opacity-50" size={32} />
                <p className="text-xl font-serif italic text-brand-blue mb-4 leading-relaxed max-w-2xl px-4">
                    &quot;{quote.q}&quot;
                </p>
                <div className="flex items-center gap-2">
                    <div className="h-[1px] w-8 bg-brand-gold/30" />
                    <p className="text-sm font-bold text-brand-blue/60 uppercase tracking-widest">
                        {quote.a}
                    </p>
                    <div className="h-[1px] w-8 bg-brand-gold/30" />
                </div>
            </div>
        </div>
    );
}
