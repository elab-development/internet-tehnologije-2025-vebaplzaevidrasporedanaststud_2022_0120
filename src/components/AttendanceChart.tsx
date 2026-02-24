"use client";

import { useEffect, useRef, useState } from "react";

interface SubjectStat {
    subjectTitle: string;
    presence: number;
    held: number;
    absence: number;
}

interface AttendanceChartProps {
    data: SubjectStat[];
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google: any;
    }
}

const LOADER_URL = "https://www.gstatic.com/charts/loader.js";

export function AttendanceChart({ data }: AttendanceChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
        () => (!data || data.length === 0) ? "ready" : "loading"
    );

    useEffect(() => {
        if (!data || data.length === 0) return;

        let cancelled = false;

        function renderChart() {
            const container = chartRef.current;
            if (!container || cancelled) return;

            window.google.charts.load("current", { packages: ["corechart"] })
                .then(() => {
                    if (cancelled) return;

                    const chartData = new window.google.visualization.DataTable();
                    chartData.addColumn("string", "Predmet");
                    chartData.addColumn("number", "Prisustva");
                    chartData.addColumn("number", "Odsustva");
                    chartData.addRows(data.map((s) => [s.subjectTitle, s.presence, s.absence]));

                    const options = {
                        title: "Statistika prisustva po predmetima",
                        titleTextStyle: { fontSize: 16, color: "#1A2E44", bold: true },
                        colors: ["#10B981", "#EF4444"],
                        chartArea: { width: "60%", height: "60%" },
                        hAxis: {
                            title: "Predmet",
                            textStyle: { fontSize: 12, color: "#1A2E44" },
                            titleTextStyle: { fontSize: 13, color: "#1A2E44", bold: true, italic: false },
                        },
                        vAxis: {
                            title: "Broj termina",
                            format: "0",
                            viewWindow: { min: 0 },
                            textStyle: { fontSize: 12, color: "#1A2E44" },
                            titleTextStyle: { fontSize: 13, color: "#1A2E44", bold: true, italic: false },
                        },
                        legend: { position: "top", alignment: "center", textStyle: { fontSize: 13, color: "#1A2E44" } },
                        animation: { duration: 800, easing: "out", startup: true },
                        bar: { groupWidth: "70%" },
                        backgroundColor: "transparent",
                    };

                    new window.google.visualization.ColumnChart(container).draw(chartData, options);
                    setStatus("ready");
                })
                .catch(() => { if (!cancelled) setStatus("error"); });
        }

        if (window.google?.charts) {
            // Loader already present and ready
            renderChart();
        } else {
            // Get existing script tag or create a new one
            let script = document.querySelector<HTMLScriptElement>(`script[src="${LOADER_URL}"]`);
            if (!script) {
                script = document.createElement("script");
                script.src = LOADER_URL;
                document.head.appendChild(script);
            }
            // Wait for loader — works both when script is new and when it's mid-load
            script.addEventListener("load", renderChart);
            script.addEventListener("error", () => { if (!cancelled) setStatus("error"); });
        }

        return () => { cancelled = true; };
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center p-10 border border-brand-blue/10 rounded-2xl bg-brand-blue/[0.02]">
                <p className="text-brand-blue/40 italic">Nema podataka za prikaz grafikona.</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex items-center justify-center p-10 border border-red-200 rounded-2xl bg-red-50">
                <p className="text-red-500 italic text-sm text-center">
                    Nije moguće učitati Google Charts.<br />
                    Proverite internet konekciju ili pokušajte ponovo.
                </p>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden" style={{ width: "100%", height: "420px" }}>
            {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                    <p className="text-brand-blue/40 animate-pulse text-sm">Učitavanje grafikona...</p>
                </div>
            )}
            <div ref={chartRef} style={{ width: "100%", height: "420px" }} />
        </div>
    );
}
