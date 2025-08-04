import React, { useState, useEffect } from "react";
import TableReception from "../components/TableReception";
import { FilePlus, Search } from "lucide-react";
import { reception } from "../types/Reception";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const Reception = () => {
  const [search, setSearch] = useState("");
  const [receptions, setReceptions] = useState<reception[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceptions = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/receptions?search=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setReceptions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des réceptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptions();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReceptions(search);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="mb-6 flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <h2 className="text-xl font-bold">Avis de Réception</h2>
        <div className="flex gap-2">
          <button
            // onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
          >
            <FilePlus className="w-4 h-4" />
            Ajouter un avis réception
          </button>
        </div>
      </div>

      <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1 border border-gray-300">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par ID, Offre, Date, Montant..."
          className="bg-transparent outline-none w-full text-sm text-gray-700"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Chargement...</div>
      ) : (
        <TableReception receptions={receptions} />
      )}
    </div>
  );
};

export default Reception;
