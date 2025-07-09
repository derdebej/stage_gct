import React from "react";
import { Eye, Pencil, Trash2, FilePlus, List, Search } from "lucide-react";
import { OffreType } from "../types/OffreType";

interface OffreProps {
  data: OffreType[];
}

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

const TableOffre: React.FC<OffreProps> = ({ data }) => {
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
                Délai
              </th>
              <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
                Paiement
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
              <tr key={offre.id} className="bg-white rounded hover:bg-gray-50">
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.id}
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.fournisseur}
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.dateSoumission}
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.montant.toLocaleString()} dt
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.delaiLivraison}
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-700">
                  {offre.conditionsPaiement}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
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
