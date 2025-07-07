import React from "react";
import { DA } from "../types/DA";
import { Column } from "../types/Column";

interface TableDAProps {
  data: DA[];
  columns: Column<DA>[];
}
const statusStyles: Record<string, string> = {
  Traité: "bg-green-100 text-green-800",
  "En Attente": "bg-yellow-100 text-yellow-800",
  "Non Traité": "bg-red-100 text-red-800",
};
const TableDA: React.FC<TableDAProps> = ({ data, columns }: TableDAProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center border-separate border-spacing-0 ">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`bg-gray-100 py-3 px-4 text-gray-800 ${
                  index === 0 ? "rounded-l-xl" : ""
                }
          ${index === columns.length - 1 ? "rounded-r-xl" : ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50 ">
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className="text-center py-3  px-4 text-sm text-gray-700"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDA;
