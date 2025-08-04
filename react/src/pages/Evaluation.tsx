import React, { useState, useEffect } from "react";
import TableEval from "../components/TableEval";
import { FilePlus, Search, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import AjouterEval from "../components/AjouterEval";
import { Eval } from "../types/Eval";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Evaluation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evaluations, setEvaluations] = useState<Eval[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvaluations = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/evaluation?page=${page}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      setEvaluations(data.evaluations); // Make sure the backend returns { evaluations, totalPages }
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Erreur lors du chargement des évaluations", err);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [page, search]);

  const handleEvaluationAdded = (newEval: Eval) => {
    // Optionally refetch or prepend without resetting pagination
    setEvaluations((prev) => [newEval, ...prev]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when search changes
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="mb-6 flex justify-between items-center border-b-2 border-gray-200 pb-4">
          <h2 className="text-xl font-bold">Liste des Evaluations</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm"
            >
              <FilePlus className="w-4 h-4" />
              Ajouter une Evaluation
            </button>
          </div>
        </div>

        <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechercher par ID, Offre, Date, Montant..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        <TableEval evaluations={evaluations} />

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
      </div>

      {isModalOpen && (
        <AjouterEval
          setIsOpen={setIsModalOpen}
          onEvaluationAdded={handleEvaluationAdded}
        />
      )}
    </>
  );
};

export default Evaluation;
