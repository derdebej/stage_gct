import React, { useState, useEffect } from "react";
import TableCommande from "../components/TableCommande";
import { FilePlus, Search, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import AjouterCommandeModal from "../components/AjouterCommande";
import { CommandeType } from "../types/Comm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Commande = () => {
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCommandeAdded = (newCommande: CommandeType) => {
    setCommandes((prev) => [newCommande, ...prev]);
  };

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/commandes?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des commandes");
        }
        const data = await response.json();
        setCommandes(data.commandes);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchCommandes();
  }, [searchTerm, page]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="mb-6 flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <h2 className="text-xl font-bold">Liste des Commandes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
        >
          <FilePlus className="w-4 h-4" />
          Ajouter une Commande
        </button>
      </div>

      <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1 border border-gray-300">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Rechercher par ID, Offre, Date, Montant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset to first page when searching
          }}
          className="bg-transparent outline-none w-full text-sm text-gray-700"
        />
      </div>

      <TableCommande data={commandes} />

      {/* Pagination */}
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
      {isModalOpen && (
        <AjouterCommandeModal
          setIsOpen={setIsModalOpen}
          onCommandeAdded={handleCommandeAdded}
        />
      )}
    </div>
  );
};

export default Commande;
