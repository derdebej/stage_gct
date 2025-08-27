import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { OffreType } from "../types/OffreType";
const baseUrl = import.meta.env.VITE_API_BASE_URL;



const ListeOffresModal = ({ setIsModalOpen, onSelectOffre }) => {
  const [search, setSearch] = useState("");
  const [offres, setOffres] = useState<OffreType[]>([]);

  const handleSelect = (offre: OffreType) => {
    onSelectOffre(offre);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/offres?search=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchOffres();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Liste des offres
        </h2>
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID, Fournisseur, Date..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {offres.length > 0 ? (
            offres.map((offre) => (
              <div
                onClick={() => handleSelect(offre)}
                key={offre.id_offre}
                className="p-2 border-b border-gray-100 hover:bg-gray-50 hover:cursor-pointer"
              >
                <p className="text-sm font-semibold text-gray-800">
                  Offre #{offre.id_offre} - {offre.fournisseur?.nom || "Fournisseur inconnu"}
                </p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(offre.date_offre).toLocaleDateString()} • Montant:  TND
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500">Aucun résultat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeOffresModal;
