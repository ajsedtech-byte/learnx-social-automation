"use client";
import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, ReactNode>[];
  onRowClick?: (index: number) => void;
}

export default function DataTable({ columns, rows, onRowClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/3">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold text-slate-400 text-${col.align || "left"} whitespace-nowrap`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-white/5 transition-colors ${onRowClick ? "cursor-pointer hover:bg-white/5" : "hover:bg-white/3"}`}
              onClick={() => onRowClick?.(i)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-${col.align || "left"} text-slate-300`}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
