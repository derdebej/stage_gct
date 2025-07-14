import React from "react";
import { Eye, Pencil, Trash2, FilePlus, List, Search } from "lucide-react";
import { OffreType } from "../types/OffreType";
import { useState, useEffect } from "react";

const getStatusStyle = (status: OffreType["statut"]) => {
  switch (status) {
    case "Acceptée":
      return "bg-green-100 text-green-800";
    case "En attente":
      return "bg-yellow-100 text-yellow-800";
    case "Rejetée":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TableOffre = () => {
  const [data, setData] = useState<OffreType[]>([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/offre")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FROM API:", data);
        setData(data);
      })
      .catch((err) => console.error(err));
  }, []);
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
              Date
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Montant
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Id Consultation
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
                {offre.date_d_offre}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.montant} dt
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {offre.id_consultation}
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

export default TableOffre;
