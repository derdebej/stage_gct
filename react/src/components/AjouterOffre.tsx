import React, { useState } from "react";
import { X, CheckCheck, Shredder } from "lucide-react";
import { Fournisseur } from "../types/fournisseur";
import FounisseursModal from "./FounisseursModal";
import { Lot } from "../types/Lot";
import LotModal from "./LotModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const AjouterOffre = ({ onClose }) => {
  const [selectedFournisseur, setSelectedFournisseur] =
    useState<Fournisseur | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [montant, setMontant] = useState(0);
  const [selectedLots, setSelectedLots] = useState<Lot[]>([]);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const handleConfirm = async () => {
    if (!selectedFournisseur || selectedLots.length === 0) {
      alert("Veuillez sélectionner un fournisseur et au moins un lot.");
      return;
    }
    try {
      const date_offre = new Date().toISOString(); // e.g., "2025-08-01T13:05:00.000Z"

      // 1. Create the offre
      const offreResponse = await fetch(
        `${baseUrl}/api/offre-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_fournisseur: selectedFournisseur.id_fournisseur,
            date_offre: date_offre,
            chemin_document: "offres/temp.pdf",
            montant: montant,
          }),
        }
      );

      if (!offreResponse.ok)
        throw new Error("Erreur lors de la création de l'offre");

      const { id_offre } = await offreResponse.json();

      // 2. Link lots to the offre
      const linkResponse = await fetch(
        `${baseUrl}/api/offres/${id_offre}/lots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lots: selectedLots.map((lot) => lot.id_lot),
          }),
        }
      );

      if (!linkResponse.ok)
        throw new Error("Erreur lors de l'association des lots");

      alert("Offre ajoutée avec succès !");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'ajout de l'offre.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close consultation modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter une offre
        </h2>
        <label>Fournisseur :</label>
        {selectedFournisseur ? (
          <div className="relative bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 text-sm text-blue-900 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-md font-bold text-blue-900">
                  {selectedFournisseur.nom}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">ID:</span>{" "}
                  {selectedFournisseur.id_fournisseur}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedFournisseur.email}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Téléphone:</span>{" "}
                  {selectedFournisseur.num_tel}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded-md text-xs"
                >
                  Changer
                </button>
                <button
                  onClick={() => setSelectedFournisseur(null)}
                  className="text-red-500 hover:text-red-700 text-xs underline"
                >
                  Désélectionner
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mb-4"
          >
            Choisir un fournisseur
          </button>
        )}

        <label>Lots associés :</label>
        {selectedLots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-4">
            {selectedLots.map((lot) => (
              <div
                key={lot.id_lot}
                className="relative bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900"
              >
                <button
                  onClick={() =>
                    setSelectedLots((prev) =>
                      prev.filter((l) => l.id_lot !== lot.id_lot)
                    )
                  }
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
                <p>
                  <span className="font-semibold">ID Lot:</span> {lot.id_lot}
                </p>
                <p>
                  <span className="font-semibold">ID DA:</span> {lot.id_da}
                </p>
                <p>
                  <span className="font-semibold">Consultation:</span>{" "}
                  {lot.id_consultation}
                </p>
              </div>
            ))}
          </div>
        )}

        <>
          <button
            onClick={() => setIsLotModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mb-2"
          >
            Choisir un Lot
          </button>
        </>
        <label>Montant :</label>
        <input
          placeholder="Montant offre"
          type="number"
          value={montant}
          onChange={(e) => setMontant(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-300 mb-2"
        />
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-white hover:bg-blue-900 text-blue-900 hover:text-white border-blue-900 border px-4 py-2 rounded-md flex items-center gap-2"
          >
            Fermer
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <CheckCheck />
            Confirmer
          </button>
        </div>
      </div>
      {isModalOpen && (
        <FounisseursModal
          setIsModalOpen={setIsModalOpen}
          setSelectedFournisseur={setSelectedFournisseur}
        />
      )}
      {isLotModalOpen && (
        <LotModal
          setIsModalOpen={setIsLotModalOpen}
          setSelectedLots={setSelectedLots}
          selectedLots={selectedLots}
        />
      )}
    </div>
  );
};

export default AjouterOffre;
