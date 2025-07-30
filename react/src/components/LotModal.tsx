import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle, Circle } from "lucide-react";
import { Lot } from "../types/Lot";

interface LotModalProps {
  setIsModalOpen: (open: boolean) => void;
  setSelectedLots: (lots: Lot[]) => void;
  selectedLots: Lot[];
}

const LotModal: React.FC<LotModalProps> = ({
  setIsModalOpen,
  setSelectedLots,
  selectedLots,
}) => {
  const [search, setSearch] = useState("");
  const [lots, setLots] = useState<Lot[]>([]);
  const [selected, setSelected] = useState<Lot[]>([]);

  // Fetch lots excluding already selected ones
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/LotsOffre?search=${encodeURIComponent(search)}`
        );
        const data: Lot[] = await res.json();

        const filtered = data.filter(
          (lot) =>
            !selectedLots.some(
              (selectedLot) => selectedLot.id_lot === lot.id_lot
            )
        );

        setLots(filtered);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchLots();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedLots]);

  // Toggle selection
  const handleToggle = (lot: Lot) => {
    const alreadySelected = selected.some((l) => l.id_lot === lot.id_lot);
    if (alreadySelected) {
      setSelected(selected.filter((l) => l.id_lot !== lot.id_lot));
    } else {
      setSelected([...selected, lot]);
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    setSelectedLots([...selectedLots, ...selected]);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Liste des Lots
        </h2>

        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID, DA, Consultation..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        {/* Lots List */}
        <div className="max-h-60 overflow-y-auto">
          {lots.length > 0 ? (
            lots.map((lot) => {
              const isSelected = selected.some((l) => l.id_lot === lot.id_lot);
              return (
                <div
                  key={lot.id_lot}
                  onClick={() => handleToggle(lot)}
                  className={`p-2 border-b border-gray-100 flex items-start justify-between hover:bg-gray-50 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {lot.id_lot}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID DA: {lot.id_da} • ID Consultation: {lot.id_consultation}
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
            <p className="text-sm text-center text-gray-500">Aucun résultat</p>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={selected.length === 0}
          className={`w-full mt-5 py-2 px-4 rounded-md text-white text-lg flex items-center justify-center gap-2 ${
            selected.length > 0
              ? "bg-blue-800 hover:bg-blue-900"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Ajouter {selected.length > 0 && `(${selected.length})`}
        </button>
      </div>
    </div>
  );
};

export default LotModal;
