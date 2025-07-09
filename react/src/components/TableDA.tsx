import React from "react";
import { DA } from "../types/DA";
import { Column } from "../types/Column";
import { Eye, Trash2, Pencil } from "lucide-react";

interface TableDAProps {
  data: DA[];
  columns: Column<DA>[];
}

const TableDA: React.FC<TableDAProps> = ({ data, columns }: TableDAProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center border-separate border-spacing-0 ">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`bg-gray-100 py-3 px-4 text-sm text-gray-800 ${
                  index === 0 ? "rounded-l-xl" : ""
                }
          `}
              >
                {col.header}
              </th>
            ))}
            <th className="bg-gray-100 py-3 px-4 text-sm text-gray-800 rounded-r-xl">
              Action
            </th>
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
              <td
                key={idx}
                className="flex justify-between gap-2 items-center py-3 px-4 "
              >
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDA;
