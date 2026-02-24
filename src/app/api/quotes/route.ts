import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Proxy: Fetching from ZenQuotes...");
        const res = await fetch("https://zenquotes.io/api/random", {
            cache: "no-store"
        });

        if (!res.ok) {
            console.error("Proxy: ZenQuotes error status", res.status);
            return NextResponse.json({ error: "Greška pri preuzimanju citata." }, { status: 502 });
        }

        const data = await res.json();
        console.log("Proxy: Data fetched successfully", data);
        return NextResponse.json(data);

    } catch (error) {
        console.error("Quote proxy error:", error);
        return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
    }
}
