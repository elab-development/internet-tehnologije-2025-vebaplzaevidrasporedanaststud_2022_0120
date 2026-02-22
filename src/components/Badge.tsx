import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "blue" | "green" | "amber" | "red" | "gray";
    dot?: boolean;
    className?: string;
}


export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "blue",
    dot = false,
    className
}) => {
    const variants = {
        blue: "bg-blue-100 border-blue-200 text-blue-800",
        green: "bg-green-100 border-green-200 text-green-800",
        amber: "bg-amber-100 border-amber-200 text-amber-800",
        red: "bg-red-100 border-red-200 text-red-800",
        gray: "bg-gray-100 border-gray-200 text-gray-800",
    };

    const dotColors = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        amber: "bg-amber-500",
        red: "bg-red-500",
        gray: "bg-gray-500",
    };

    return (
        <div className={cn(
            "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest",
            variants[variant],
            className
        )}>
            {dot && (
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    dotColors[variant],
                    variant === "green" && "animate-pulse" // Only pulse for active green states
                )} />
            )}
            {children}
        </div>
    );
};
