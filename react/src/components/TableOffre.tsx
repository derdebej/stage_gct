import React from "react";
import { Eye, Pencil, Trash2, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { OffreType } from "../types/OffreType";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getStatusStyle = (status: OffreType["statut"]) => {
  switch (status) {
    case "évalué":
      return "bg-green-100 text-green-800";
    case "Non évalué":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
type TableOffreProps = {
  search: string;
};

const TableOffre = ({search}:TableOffreProps) => {
  const [data, setData] = useState<OffreType[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);
  useEffect(() => {
    fetch(
      `${baseUrl}/api/offre?page=${page}&search=${encodeURIComponent(search)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.offres);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error("Erreur chargement:", err));
  }, [page, search]);

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
      const res = await fetch(`${baseUrl}/api/offre-delete/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((o) => o.id_offre !== deleteId));
      } else {
        console.error("Erreur suppression offre");
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
              Fournisseur
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              ID Consultation
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Montant
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Chemin Offre
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
          {data.map((offre) => (
            <tr
              key={offre.id_offre}
              className="bg-white rounded hover:bg-gray-50"
            >
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.id_offre}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.id_fournisseur}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.id_consultation}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.date_offre.slice(0, 10)}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.montant} dt
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.chemin_document}
              </td>
              <td className="px-4 py-2">
                <span
                  className={` px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    offre.statut
                  )}`}
                >
                  {offre.statut}
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
                  onClick={() => openConfirm(offre.id_offre)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 bg-gray-200 rounded-xl py-2 px-4 w-max mt-4 text-gray-800">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer flex hover:bg-gray-100 bg-white py-1 px-2 rounded-lg"
        >
          <ArrowBigLeft /> Precedent
        </button>
        <span className="bg-white py-1 px-2 rounded-lg">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="cursor-pointer flex hover:bg-gray-100 bg-white py-1 px-2 rounded-lg"
        >
          Suivant <ArrowBigRight />
        </button>
      </div>
      {confirmOpen && (
        <ConfirmModal
          isOpen={confirmOpen}
          message={
            <>
              <p className="text-xl mb-4 border-b pb-4 border-b-gray-300">
                Êtes-vous sûr de vouloir supprimer cette offre ?
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

export default TableOffre;
