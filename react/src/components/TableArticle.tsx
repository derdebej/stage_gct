import React from "react";
import { Art } from "../types/Art";
import { Eye, Trash2, Pencil, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const TableArticle = ({ page, setPage, search, limit }) => {
  const [articles, setArticles] = useState<Art[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    fetch(`${baseUrl}/api/articles?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page, search, limit]);
  return (
    <>
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
    </>
  );
};

export default TableArticle;
