import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] font-bold text-brand-blue/60 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        "w-full px-6 py-4 rounded-2xl border border-brand-blue/20 bg-white/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 outline-none transition-all font-medium text-brand-blue appearance-none shadow-sm",
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
);

Select.displayName = "Select";
