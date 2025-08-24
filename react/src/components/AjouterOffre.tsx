import React, { useState, useEffect, use } from "react";
import { X, CheckCheck, PlusCircle } from "lucide-react";
import { Fournisseur } from "../types/fournisseur";
import FounisseursModal from "./FounisseursModal";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { ArticleOffre } from "../types/ArticleOffre";
import { LotOffre } from "../types/LotOffre";
import ItemSelector from "./ItemSelector";
import { consultationType } from "../types/consultationType";
import ConsModal from "./ConsModal";
import { CircleCheckBig } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterOffre = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFournisseur, setSelectedFournisseur] =
    useState<Fournisseur | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLots, setSelectedLots] = useState<LotOffre[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<ArticleOffre[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [isConsModalOpen, setIsConsModalOpen] = useState(false);
  type CreatedOffre = {
    id_offre: string;
    id_consultation: string;
    fournisseur_name: string;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleConfirmAndUpload = async () => {
    if (!selectedConsultation) {
      setMessage("Veuillez choisir une consultation.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 2000);
      return;
    }

    const isEquipement = selectedConsultation.type === "equipement";

    if (
      !selectedFournisseur ||
      (isEquipement ? selectedLots.length === 0 : selectedArticles.length === 0)
    ) {
      setMessage(
        "Veuillez sélectionner un fournisseur et au moins un élément."
      );
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 2000);
      return;
    }

    try {
      setIsSubmitting(true);
      const date_offre = new Date().toISOString();
      const offreRes = await fetch(`${baseUrl}/api/offre-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_fournisseur: selectedFournisseur.id_fournisseur,
          date_offre,
          chemin_document: "Sans fichier",
          id_consultation: selectedConsultation.id_consultation,
        }),
      });
      if (!offreRes.ok)
        throw new Error("Erreur lors de la création de l'offre");
      const { id_offre } = await offreRes.json();

      const created: CreatedOffre = {
        id_offre,
        id_consultation: selectedConsultation.id_consultation,
        fournisseur_name: selectedFournisseur.nom,
      };

      const payload = isEquipement
        ? {
            lots: selectedLots.map((lot) => ({
              id_lot: lot.id_lot,
              montant: lot.montant,
            })),
          }
        : {
            articles: selectedArticles.map((a) => ({
              id_article: a.id_article,
              id_da: a.id_da,
              montant: a.montant,
            })),
          };

      const linkUrl = isEquipement
        ? `${baseUrl}/api/offres/${id_offre}/lots`
        : `${baseUrl}/api/offres/${id_offre}/articles`;

      const linkRes = await fetch(linkUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!linkRes.ok)
        throw new Error("Erreur lors de l'association des éléments");

      if (file) {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("id_offre", created.id_offre);
        formData.append("id_consultation", created.id_consultation);
        formData.append("fournisseur_name", created.fournisseur_name);

        const uploadRes = await fetch(`${baseUrl}/api/upload-offre-document`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Échec de l'upload du document");
      }

      setMessage("Offre enregistrée avec succès.");
      setMessageType("success");
      setSelectedFournisseur(null);
      setFile(null);
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err?.message || "Une erreur est survenue lors de l'enregistrement.";
      setMessage(errorMsg);
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (messageType === "success") {
    return (
      <div
        className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50`}
      >
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          <CircleCheckBig className="text-green-600" size={28} />
          {message}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
            Ajouter une offre
          </h2>
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close consultation modal"
            >
              <X size={20} />
            </button>
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
            <div className="mt-4">
              <h4>Uploader le document de l'offre</h4>
              {file && <div>Nom de fichier à ajouter: {file.name}</div>}
              <label className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <PlusCircle /> Ajouter un document
              </label>
            </div>

            <div className="mt-10 flex justify-between">
              <button
                onClick={onClose}
                className="bg-white hover:bg-blue-900 text-blue-900 hover:text-white border-blue-900 border px-4 py-2 rounded-md flex items-center gap-2"
              >
                Fermer
              </button>
              <button
                onClick={handleConfirmAndUpload}
                disabled={isSubmitting}
                className="bg-blue-800 hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <CheckCheck />
                {isSubmitting ? "Traitement..." : "Confirmer & Upload"}
              </button>
            </div>
          </>

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
      </div>
      {message === "error" && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg bg-red-100 text-red-800 border border-red-300">
          {message}
        </div>
      )}
    </>
  );
};

export default AjouterOffre;
