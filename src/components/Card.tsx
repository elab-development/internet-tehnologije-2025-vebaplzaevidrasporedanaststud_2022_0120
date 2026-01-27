import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "glass" | "solid" | "primary";
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    variant = "glass",
    hover = false
}) => {
    const variants = {
        glass: "glass-morphism border border-brand-blue/20 shadow-brand-blue/10 bg-white/40",
        solid: "bg-white border border-gray-100 shadow-gray-200/50",
        primary: "bg-brand-blue border-transparent text-white shadow-xl shadow-brand-blue/20"
    };

    return (
        <div className={cn(
            "rounded-[2rem] p-8 transition-all duration-300",
            variants[variant],
            hover && "hover:scale-[1.01] hover:shadow-brand-blue/15",
            className
        )}>
            {children}
        </div>
    );
};
