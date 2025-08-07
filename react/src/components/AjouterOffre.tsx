import React, { useState, useEffect } from "react";
import { X, CheckCheck, Shredder } from "lucide-react";
import { Fournisseur } from "../types/fournisseur";
import FounisseursModal from "./FounisseursModal";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { ArticleOffre } from "../types/ArticleOffre";
import { LotOffre } from "../types/LotOffre";
import ItemSelector from "./ItemSelector";
import { consultationType } from "../types/consultationType";
import ConsModal from "./ConsModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterOffre = ({ onClose }) => {
  const [selectedFournisseur, setSelectedFournisseur] =
    useState<Fournisseur | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLots, setSelectedLots] = useState<LotOffre[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ArticleOffre[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [isConsModalOpen, setIsConsModalOpen] = useState(false);
  const handleConfirm = async () => {
    const isEquipement = selectedConsultation.type === "equipement";

    if (
      !selectedFournisseur ||
      (isEquipement ? selectedLots.length === 0 : selectedArticles.length === 0)
    ) {
      alert("Veuillez sélectionner un fournisseur et au moins un élément.");
      return;
    }

    try {
      const date_offre = new Date().toISOString();

      // 1. Create the offer
      const offreResponse = await fetch(`${baseUrl}/api/offre-insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_fournisseur: selectedFournisseur.id_fournisseur,
          date_offre: date_offre,
          chemin_document: "offres/temp.pdf",
          id_consultation: selectedConsultation.id_consultation,
        }),
      });

      if (!offreResponse.ok)
        throw new Error("Erreur lors de la création de l'offre");

      const { id_offre } = await offreResponse.json();

      // 2. Link lots or articles to the offer
      const payload = isEquipement
        ? {
            lots: selectedLots.map((lot) => ({
              id_lot: lot.id_lot,
              montant: lot.montant,
            })),
          }
        : {
            articles: selectedArticles.map((article) => ({
              id_article: article.id_article,
              id_da: article.id_da,
              montant: article.montant,
            })),
          };

      const linkUrl = isEquipement
        ? `${baseUrl}/api/offres/${id_offre}/lots`
        : `${baseUrl}/api/offres/${id_offre}/articles`;

      const linkResponse = await fetch(linkUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!linkResponse.ok)
        throw new Error("Erreur lors de l'association des éléments");

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
        <label>Consultation associé :</label>
        {selectedConsultation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-4">
            <div className="relative bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900">
              <button
                onClick={() => {
                  setSelectedConsultation(null);
                  setSelectedArticles([]);
                  setSelectedLots([]);
                }}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
              <p>
                <span className="font-semibold">ID Consultation:</span>{" "}
                {selectedConsultation.id_consultation}
              </p>
              <p>
                <span className="font-semibold">Date de Creation:</span>{" "}
                {selectedConsultation.date_creation.slice(0, 10)}
              </p>
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {selectedConsultation.type}
              </p>
            </div>
          </div>
        )}
        {!selectedConsultation && (
          <button
            onClick={() => setIsConsModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mb-2"
          >
            Choisir une consultation
          </button>
        )}

        {selectedConsultation && (
          <ItemSelector
            selectedConsultation={selectedConsultation}
            setSelectedLots={setSelectedLots}
            selectedLots={selectedLots}
            selectedArticles={selectedArticles}
            setSelectedArticles={setSelectedArticles}
          />
        )}
        <div className="mt-10 flex justify-between">
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
      {isConsModalOpen && (
        <ConsModal
          setSelectedConsultations={setSelectedConsultation}
          selectedConsultations={selectedConsultation}
          setIsModalOpen={setIsConsModalOpen}
        />
      )}
    </div>
  );
};

export default AjouterOffre;
