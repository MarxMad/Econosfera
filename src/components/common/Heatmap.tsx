"use client";

import React from "react";

interface HeatmapProps {
    title: string;
    subtitle?: string;
    xAxisLabel: string;
    yAxisLabel: string;
    xValues: number[] | string[];
    yValues: number[] | string[];
    data: number[][];
    formatter: (val: number) => string;
}

export default function Heatmap({
    title,
    subtitle,
    xAxisLabel,
    yAxisLabel,
    xValues,
    yValues,
    data,
    formatter
}: HeatmapProps) {
    // Encontrar min/max para el color
    const allValues = data.flat();
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const getColor = (val: number) => {
        const ratio = (val - min) / (max - min || 1);
        // Escala de azul (claro a oscuro)
        const opacity = 0.1 + ratio * 0.9;
        return `rgba(37, 99, 235, ${opacity})`;
    };

    return (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                {yAxisLabel} \ {xAxisLabel}
                            </th>
                            {xValues.map((x, i) => (
                                <th key={i} className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {x}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {yValues.map((y, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {y}
                                </td>
                                {data[rowIdx].map((val, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="p-2 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-xs text-center font-mono transition-colors hover:ring-2 hover:ring-blue-400"
                                        style={{ backgroundColor: getColor(val), color: (val - min) / (max - min) > 0.5 ? 'white' : 'inherit' }}
                                        title={`Val: ${formatter(val)}`}
                                    >
                                        {formatter(val)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-500">
                <span>Menor</span>
                <div className="w-20 h-2 bg-gradient-to-r from-blue-50 to-blue-600 rounded-full" />
                <span>Mayor</span>
            </div>
        </div>
    );
}
