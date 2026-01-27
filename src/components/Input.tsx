import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] font-bold text-brand-blue/60 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-6 py-4 rounded-2xl border border-brand-blue/20 bg-white/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 outline-none transition-all font-medium text-brand-blue placeholder:text-brand-blue/30 shadow-sm",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
