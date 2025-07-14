import React from "react";
import { DA } from "../types/DA";
import { Column } from "../types/Column";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import DemandeDetailsModal from "./DaDetaills";
import { useEffect } from "react";

interface TableDAProps {
  columns: Column<DA>[];
  onSelectionChange?: (selected: DA[]) => void;
  selectedRows?: DA[];
}

const TableDA: React.FC<TableDAProps> = ({
  columns,
  onSelectionChange,
  selectedRows = [],
}: TableDAProps) => {
  const [selectedDemande, setSelectedDemande] = useState<DA | null>(null);
  //const [selectedRows, setSelectedRows] = useState<DA[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demandes, setDemandes] = useState<DA[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/demandes")
      .then((res) => res.json())
      .then((data) => setDemandes(data))
      .catch((err) => console.error(err));
  }, []);

  const openDetails = (demande: DA) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };
  const toggleSelection = (demande: DA, isChecked: boolean) => {
    if (!onSelectionChange) return;

    let updatedSelection: DA[];
    if (isChecked) {
      updatedSelection = selectedRows.some(
        (d) => Number(d.id_da) === Number(demande.id_da)
      )
        ? selectedRows
        : [...selectedRows, demande];
    } else {
      updatedSelection = selectedRows.filter(
        (d) => Number(d.id_da) !== Number(demande.id_da)
      );
    }

    onSelectionChange(updatedSelection);
  };

  const isRowSelected = (demande: DA) => {
    return selectedRows.some((d) => Number(d.id_da) === Number(demande.id_da));
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center border-separate border-spacing-0 ">
        <thead>
          <tr>
            <th className="bg-gray-100 py-3 px-4 text-sm text-gray-800 rounded-l-xl"></th>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`bg-gray-100 py-3 px-4 text-sm text-gray-800 
                  
                
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
          {demandes.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50 ">
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={isRowSelected(row)}
                  onChange={(e) => toggleSelection(row, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </td>
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className="text-center py-3  px-4 text-sm text-gray-700"
                >
                  {(() => {
                    const value = col.render
                      ? col.render(row[col.key], row)
                      : row[col.key];
                    if (Array.isArray(value)) {
                      // Map Art[] to ReactNode[]
                      return value.map((item, i) => (
                        <span key={i}>{String(item)}</span>
                      ));
                    }
                    return value;
                  })()}
                </td>
              ))}
              <td
                key={idx}
                className="flex justify-between gap-2 items-center py-3 px-4 "
              >
                <button
                  onClick={() => openDetails(row)}
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
      {selectedDemande && (
        <DemandeDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          demande={selectedDemande}
        />
      )}
    </div>
  );
};

export default TableDA;
