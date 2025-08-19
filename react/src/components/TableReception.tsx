import React, { useEffect } from "react";
import { useState } from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import { reception } from "../types/Reception";
import ConfirmModal from "./ConfirmModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
interface props {
  receptions: reception[];
}

const TableReception = ({ receptions }: props) => {
  const [receptionList, setReceptionList] = useState<reception[]>(receptions);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setReceptionList(receptions);
  }, [receptions]);

  const handleCancelDeleteReception = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDeleteReception = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${baseUrl}/api/receptions/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReceptionList((prev) =>
          prev.filter((r) => r.id_reception !== deleteId)
        );
      } else {
        console.error("Échec suppression réception");
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
              Id Commande
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Type
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date reception
            </th>
            <th className="rounded-r-xl text-center py-3 px-4 text-sm  text-gray-800 bg-gray-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {receptionList.map((reception) => (
            <tr
              key={reception.id_reception}
              className="bg-white rounded hover:bg-gray-50"
            >
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.id_reception}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.id_commande}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.type}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.date.slice(0, 10)}
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
                  onClick={() => {
                    setDeleteId(reception.id_reception);
                    setConfirmOpen(true);
                  }}
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
                Supprimer reception {deleteId} ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </>
          }
          onConfirm={handleConfirmDeleteReception}
          onCancel={handleCancelDeleteReception}
        />
      )}
    </div>
  );
};

export default TableReception;
