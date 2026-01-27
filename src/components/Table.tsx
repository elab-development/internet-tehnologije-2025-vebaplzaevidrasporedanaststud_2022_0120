import React from "react";
import { cn } from "@/lib/utils";

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

/**
 * Reusable Table component with consistent styling.
 * Encapsulates standard layout for data displays.
 */
export const Table: React.FC<TableProps> = ({ headers, children, className }) => {
    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr className="border-b border-brand-blue/10">
                        {headers.map((header) => (
                            <th
                                key={header}
                                className={cn(
                                    "py-4 px-4 text-xs font-bold text-brand-blue/60 uppercase tracking-widest",
                                    (header === "Tip" || header === "Kabinet") ? "text-center" : "text-left",
                                    header === "Vreme" && "w-[20%]",
                                    header === "Predmet" && "w-[30%]",
                                    header === "Tip" && "w-[25%]",
                                    header === "Kabinet" && "w-[25%]"
                                )}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-blue/5">
                    {children}
                </tbody>
            </table>
        </div>
    );
};
