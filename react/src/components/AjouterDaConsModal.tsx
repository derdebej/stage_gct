import React, { useState, useEffect } from "react";
import { X, Search, PlusCircle, ChevronLeft } from "lucide-react";
import { DA } from "../types/DA";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterDaConsModal = ({ setIsModalOpen, id_consultation, onDaAdded }) => {
  const [search, setSearch] = useState("");
  const [demandes, setDemandes] = useState<DA[]>([]);
  const [selectedDa, setSelectedDa] = useState<DA | null>(null);
  const [selection, setSelection] = useState(false);
  const [lotNumber, setLotNumber] = useState("");

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/demande-non-traitee?search=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        setDemandes(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchDemandes();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);
  const handleConfirm = () => {
    if (!selectedDa || !lotNumber) return;
    onDaAdded(selectedDa, lotNumber);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        {!selection && (
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
              Liste des Demandes d'achats
            </h2>
            <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par ID ou Titre ..."
                className="bg-transparent outline-none w-full text-sm text-gray-700"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {demandes.length > 0 ? (
                demandes.map((demande, index) => (
                  <div
                    key={index}
                    className="flex justify-between pr-5 items-center hover:bg-gray-100 rounded-xl"
                  >
                    <div
                      key={demande.id_da}
                      className="p-2 border-b border-gray-100"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {demande.titre}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {demande.id_da} • Montant: {demande.montant} • Date:{" "}
                        {demande.date}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDa(demande);
                        setSelection(true);
                      }}
                      className="text-green-700 hover:text-green-800 cursor-pointer"
                    >
                      <PlusCircle size={25} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">
                  Aucun résultat
                </p>
              )}
            </div>
          </>
        )}
        {selection && selectedDa && (
          <>
            <button
              onClick={() => {
                setSelection(false);
                setSelectedDa(null);
              }}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft size={25} />
            </button>
            <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
              Ajouter un lot
            </h2>
            <div className="space-y-2 text-sm border border-gray-200 p-4">
              <div>
                <strong>ID DA :</strong> {selectedDa.id_da}
              </div>
              <div>
                <strong>Titre :</strong> {selectedDa.titre}
              </div>
              <div>
                <strong>Date :</strong>{" "}
                {new Date(selectedDa.date).toLocaleDateString("fr-FR")}
              </div>
              <div>
                <strong>Montant estimé :</strong> {selectedDa.montant} TND
              </div>
              <div>
                <strong>Statut :</strong> {selectedDa.etat}
              </div>
            </div>
            <div className="mt-4 text-gray-700 flex flex-col gap-2">
              <label>N° Lot Consultation</label>
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-max px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-300"
              />
            </div>
            <div className=" flex justify-between mt-6 text-right">
              <button
                onClick={() => {
                  setSelection(false);
                  setSelectedDa(null);
                }}
                className="px-4 py-2  text-blue-800 border-2 border-blue-900 rounded-md bg-white hover:bg-blue-900 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900 "
              >
                Confirmer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AjouterDaConsModal;
