import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle, Circle } from "lucide-react";
import { consultationType } from "../types/consultationType";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ConsModalProps {
  setIsModalOpen: (open: boolean) => void;
  selectedConsultations: consultationType | null;
  setSelectedConsultations: (cons: consultationType | null) => void;
}

const ConsModal: React.FC<ConsModalProps> = ({
  setIsModalOpen,
  selectedConsultations,
  setSelectedConsultations,
}) => {
  const [search, setSearch] = useState("");
  const [consultations, setConsultations] = useState<consultationType[]>([]);
  const [selected, setSelected] = useState<consultationType | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/consultation-offre?search=${encodeURIComponent(
            search
          )}`
        );
        const data: consultationType[] = await res.json();
        const filtered = data.filter(
          (cons) =>
            cons.id_consultation !== selectedConsultations?.id_consultation
        );
        setConsultations(filtered);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchConsultations();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSelect = (cons: consultationType) => {
    if (selected?.id_consultation === cons.id_consultation) {
      setSelected(null); // Unselect if already selected
    } else {
      setSelected(cons);
    }
  };

  const handleConfirm = () => {
    setSelectedConsultations(selected);
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
          Liste des Consultations
        </h2>

        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID, objet..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        {/* Consultation List */}
        <div className="max-h-60 overflow-y-auto">
          {consultations.length > 0 ? (
            consultations.map((cons) => {
              const isSelected =
                selected?.id_consultation === cons.id_consultation;
              return (
                <div
                  key={cons.id_consultation}
                  onClick={() => handleSelect(cons)}
                  className={`p-2 border-b border-gray-100 flex items-start justify-between hover:bg-gray-50 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {cons.id_consultation} — {cons.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(cons.date_creation).toLocaleDateString()}
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

export default ConsModal;
