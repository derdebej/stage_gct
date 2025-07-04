import React from "react";
import { DA } from "../types/DA";

interface TableDAProps {
  data: DA[];
}
const statusStyles: Record<string, string> = {
  Traité: "bg-green-100 text-green-800",
  "En Attente": "bg-yellow-100 text-yellow-800",
  "Non Traité": "bg-red-100 text-red-800",
};
const TableDA: React.FC<TableDAProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Demandes d'achats
        </h2>
        <select className="border rounded-md px-3 py-1 text-sm text-gray-700">
          <option value="janvier">Janvier</option>
          <option value="février">Février</option>
          <option value="mars">Mars</option>
          <option value="avril">Avril</option>
          <option value="mai">Mai</option>
          <option value="juin">Juin</option>
          <option value="juillet">Juillet</option>
          <option value="août">Août</option>
          <option value="septembre">Septembre</option>
          <option value="octobre">Octobre</option>
          <option value="novembre">Novembre</option>
          <option value="décembre">Décembre</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className=" text-sm text-gray-500">
              <th className="bg-gray-100  py-3 px-4 rounded-l-full">ID</th>
              <th className="bg-gray-100 py-3 px-4">Titre</th>
              <th className="bg-gray-100 py-3 px-4">Date de création</th>
              <th className="bg-gray-100 py-3 px-4">Nombre des lots</th>
              <th className="bg-gray-100 py-3 px-4">Prix estimé</th>
              <th className="bg-gray-100 py-3 px-4 rounded-r-full">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 ">
                <td className="py-3  px-4 text-sm text-gray-700">{item.id}</td>
                <td className="py-3  px-4 text-sm text-gray-700">
                  {item.titre}
                </td>
                <td className="py-3  px-4 text-sm text-gray-700">
                  {item.date}
                </td>
                <td className="py-3  px-4 text-sm text-gray-700">
                  {item.lots}
                </td>
                <td className="py-3  px-4 text-sm text-gray-700">
                  {item.prix}
                </td>
                <td className="py-3  px-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      statusStyles[item.statut]
                    }`}
                  >
                    {item.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDA;
