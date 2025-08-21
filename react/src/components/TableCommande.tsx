import React from "react";
import { CommandeType } from "../types/Comm";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import CommandeDetail from "./commandeDetail";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface TableCommandeProps {
  data: CommandeType[];
}

const TableCommande = ({ data }: TableCommandeProps) => {
  const [commandeList, setCommandeList] = useState<CommandeType[]>(data);
  useEffect(() => {
    setCommandeList(data);
  }, [data]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIdCommande, setSelectedIdCommande] = useState(null);

  const handleCancelDeleteCommande = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleConfirmDeleteCommande = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${baseUrl}/api/commandes/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCommandeList((prev) =>
          prev.filter((c) => String(c.id_commande) !== String(deleteId))
        );
      } else {
        console.error("Échec suppression commande");
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
              ID fournisseur
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              ID consultation
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Type
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Montant
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date
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
          {commandeList.map((commande) => (
            <tr
              key={commande.id_commande}
              className="bg-white rounded hover:bg-gray-50"
            >
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {commande.id_commande}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {commande.id_fournisseur}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {commande.id_consultation}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {commande.type}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                a ajouter
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {commande.date
                  ? new Date(commande.date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    commande.statut === "Terminée"
                      ? "bg-green-100 text-green-800"
                      : commande.statut === "En cours"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {commande.statut}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir"
                  onClick={() => {
                    setSelectedIdCommande(commande.id_commande);
                    setDetailOpen(true);
                  }}
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
                    setDeleteId(commande.id_commande);
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
                Supprimer Commande {deleteId} ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </>
          }
          onConfirm={handleConfirmDeleteCommande}
          onCancel={handleCancelDeleteCommande}
        />
      )}
      {detailOpen && (
        <CommandeDetail
          id_commande={selectedIdCommande}
          onClose={() => {
            setDetailOpen(false);
            setSelectedIdCommande(null);
          }}
        />
      )}
    </div>
  );
};

export default TableCommande;
