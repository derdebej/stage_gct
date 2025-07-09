import React from "react";
import { Eval } from "../types/Eval";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TableEvalProps {
  data: Eval[];
}

const TableEval = ({ data }: TableEvalProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="rounded-l-xl text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              ID
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Id Offre
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Montant
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Id Consultation
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Chemin Evaluation
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Statut
            </th>
            <th className="rounded-r-xl text-center py-3 px-4 text-sm  text-gray-800 bg-gray-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((evalItem) => (
            <tr key={evalItem.id} className="bg-white rounded hover:bg-gray-50">
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.id}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.IdOffre}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.date}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.montant.toLocaleString()} dt
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.IdConsultation}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.CheminEvaluation}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    evalItem.statut === "Conforme"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {evalItem.statut}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2 justify-center">
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

export default TableEval;
