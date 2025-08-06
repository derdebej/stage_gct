import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Lot } from "../types/Lot";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ListeLotsModal = ({ setIsModalOpen, onSelectLot, filterByOffre }) => {
  const [search, setSearch] = useState("");
  const [lots, setLots] = useState<Lot[]>([]);

  const handleSelect = (lot: Lot) => {
    onSelectLot(lot);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/lot-par-offre/${filterByOffre}?search=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setLots(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delay = setTimeout(() => {
      if (filterByOffre) fetchLots();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, filterByOffre]);

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
          Liste des lots
        </h2>
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl border border-gray-300 my-5">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID, consultation, etc."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {lots.length > 0 ? (
            lots.map((lot) => (
              <div
                key={lot.id_lot}
                onClick={() => handleSelect(lot)}
                className="p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <p className="text-sm font-semibold text-gray-800">Lot #{lot.id_lot}</p>
                <p className="text-xs text-gray-500">
                  Consultation: {lot.id_consultation} • DA: {lot.id_da}
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

export default ListeLotsModal;
