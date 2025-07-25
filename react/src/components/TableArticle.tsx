import React from "react";
import { Art } from "../types/Art";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const TableArticle = ({search}) => {
  const [articles, setArticles] = useState<Art[]>([]);
  useEffect(() => {
    const url = search
      ? `http://localhost:3001/api/articles?search=${encodeURIComponent(search)}`
      : "http://localhost:3001/api/articles";

    fetch(url)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err));
  }, [search]);
  return (
    <table className="w-full text-center border-separate border-spacing-0 ">
      <thead>
        <tr>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-l-xl">
            ID
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            ID DA
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Designation
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Description
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Prix Unitaire
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Quantité
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-r-xl">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {articles.map((row, idx) => (
          <tr key={idx} className="border-t hover:bg-gray-50 ">
            <td className="text-left py-3 px-4 text-sm text-gray-700 rounded-l-xl">
              {row.id_article}
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              {row.id_da}
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              {row.designation}
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              {row.description || "Sans description"}
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700 rounded-r-xl">
              {row.prix_unitaire} dt
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              {row.quantite}
            </td>
            <td
              key={idx}
              className="flex justify-between items-center py-3 px-4 "
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
  );
};

export default TableArticle;
