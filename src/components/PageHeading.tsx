import React from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
    title: string;
    subtitle?: string;
    className?: string;
}


export const PageHeading: React.FC<PageHeadingProps> = ({
    title,
    subtitle,
    className
}) => {
    return (
        <header className={cn("mb-12 animate-in fade-in slide-in-from-left duration-700", className)}>
            <h1 className="text-4xl font-serif font-bold text-brand-blue mb-2">
                {title}
            </h1>
            {subtitle && (
                <p className="text-brand-blue/60 font-medium">
                    {subtitle}
                </p>
            )}
        </header>
    );
};
