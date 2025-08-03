import React from "react";
import { Eval } from "../types/Eval";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
type Props = {
  evaluations: Eval[];
  search: string;
};

const TableEval = ({ evaluations, search }: Props) => {
  const [evalList, setEvalList] = useState<Eval[]>(evaluations);
  useEffect(() => {
    setEvalList(evaluations);
  }, [evaluations]);

  const filtered = evalList.filter((ev) => {
    const lower = search.toLowerCase();
    return (
      ev.id_eval.toLowerCase().includes(lower) ||
      ev.id_offre.toLowerCase().includes(lower) ||
      ev.conformite.toLowerCase().includes(lower) ||
      ev.date.toLowerCase().includes(lower)
    );
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openConfirm = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${baseUrl}/api/evaluation-delete/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvalList((prev) => prev.filter((e) => e.id_eval !== deleteId));
      } else {
        console.error("Échec suppression évaluation");
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }

    setConfirmOpen(false);
    setDeleteId(null);
  };

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
              Fournisseur
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date
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
          {filtered.map((evalItem) => (
            <tr
              key={evalItem.id_eval}
              className="bg-white rounded hover:bg-gray-50"
            >
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.id_eval}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.id_offre}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.id_fournisseur}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.date.slice(0, 10)}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {evalItem.chemin_document}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    evalItem.conformite === "Conforme"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {evalItem.conformite}
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
                  onClick={() => openConfirm(evalItem.id_eval)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmOpen && (
        <ConfirmModal
          isOpen={confirmOpen}
          message={
            <>
              <p className="text-xl mb-4 border-b pb-4 border-b-gray-300">
                Supprimer cette évaluation ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </>
          }
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default TableEval;
