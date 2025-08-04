import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle, Circle } from "lucide-react";
import { Lot } from "../types/Lot";
import { OffreType } from "../types/OffreType";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface LotEvalModalProps {
  setIsModalOpen: (open: boolean) => void;
  onSelectedLot: (lot: Lot | null) => void;
  selectedLot: Lot | null;
  selectedOffre: OffreType | null;
}

const LotEvalModal: React.FC<LotEvalModalProps> = ({
  setIsModalOpen,
  onSelectedLot,
  selectedLot,
  selectedOffre,
}) => {
  const [search, setSearch] = useState("");
  const [lots, setLots] = useState<Lot[]>([]);
  const [selected, setSelected] = useState<Lot | null>(selectedLot);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/lots-by-offre/${selectedOffre?.id_offre}?search=${encodeURIComponent(
            search
          )}`
        );
        const data: Lot[] = await res.json();
        setLots(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delay = setTimeout(() => {
      if (selectedOffre) {
        fetchLots();
      } else {
        setLots([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search, selectedOffre]);

  const handleSelect = (lot: Lot) => {
    setSelected(lot.id_lot === selected?.id_lot ? null : lot);
  };

  const handleConfirm = () => {
    onSelectedLot(selected);
  };

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
          Sélectionner un Lot à évaluer
        </h2>

        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID, DA..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          {lots.length > 0 ? (
            lots.map((lot) => {
              const isSelected = selected?.id_lot === lot.id_lot;
              return (
                <div
                  key={lot.id_lot}
                  onClick={() => handleSelect(lot)}
                  className={`p-2 border-b border-gray-100 flex items-start justify-between hover:bg-gray-50 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {lot.id_lot}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID DA: {lot.id_da} • ID Consultation:{" "}
                      {lot.id_consultation}
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle className="text-blue-700 w-5 h-5 mt-1" />
                  ) : (
                    <Circle className="text-gray-300 w-5 h-5 mt-1" />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-center text-gray-500">
              Aucun résultat
            </p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full mt-5 py-2 px-4 rounded-md text-white text-lg flex items-center justify-center gap-2 ${
            selected
              ? "bg-blue-800 hover:bg-blue-900"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Sélectionner
        </button>
      </div>
    </div>
  );
};

export default LotEvalModal;
