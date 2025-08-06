import React, { useState } from "react";
import { X } from "lucide-react";
import ListeConsultationsModal from "./ListeConsultationsModal";
import ListeOffresModal from "./ListeOffresModal";
import ListeLotsModal from "./ListeLotsModal";
import { consultationType } from "../types/consultationType";
import { OffreType } from "../types/OffreType";
import { Lot } from "../types/Lot";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterCommandeModal = ({ setIsOpen, onCommandeAdded }) => {
  const [form, setForm] = useState({
    id_consultation: "",
    id_offre: "",
    id_lot: "",
    date_commande: new Date().toISOString().split("T")[0],
  });

  const [selectedConsultation, setSelectedConsultation] = useState<consultationType | null>(null);
  const [selectedOffre, setSelectedOffre] = useState<OffreType | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isOffreModalOpen, setIsOffreModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  const handleConsultationSelect = (consultation: consultationType) => {
    setSelectedConsultation(consultation);
    setForm(prev => ({ ...prev, id_consultation: consultation.id_consultation }));
    setIsConsultModalOpen(false);
    setSelectedOffre(null);
    setSelectedLot(null);
  };

  const handleOffreSelect = (offre: OffreType) => {
    setSelectedOffre(offre);
    setForm(prev => ({ ...prev, id_offre: offre.id_offre }));
    setIsOffreModalOpen(false);
    setSelectedLot(null);
  };

  const handleLotSelect = (lot: Lot) => {
    setSelectedLot(lot);
    setForm(prev => ({ ...prev, id_lot: lot.id_lot }));
    setIsLotModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/commande-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la commande");

      const newCommande = await res.json();
      onCommandeAdded(newCommande);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-1000">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter une commande
        </h2>

        {/* Consultation Section */}
        <label>Consultation :</label>
        {selectedConsultation ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3 text-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-900">
                Consultation #{selectedConsultation.id_consultation}
              </p>
              <button
                className="text-xs text-blue-700 underline"
                onClick={() => {
                  setSelectedConsultation(null);
                  setSelectedOffre(null);
                  setSelectedLot(null);
                }}
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsConsultModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md  mb-4 block"
          >
            Choisir une Consultation
          </button>
        )}

        {/* Offre Section */}
        <label>Offre :</label>
        {selectedOffre ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3 text-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-900">
                Offre #{selectedOffre.id_offre} - {selectedOffre.fournisseur.nom}
              </p>
              <button
                className="text-xs text-blue-700 underline"
                onClick={() => {
                  setSelectedOffre(null);
                  setSelectedLot(null);
                }}
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <button
            disabled={!selectedConsultation}
            onClick={() => setIsOffreModalOpen(true)}
            className={`px-4 py-2 rounded-md block mb-4 text-white ${
              !selectedConsultation ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
            }`}
          >
            Choisir une Offre
          </button>
        )}

        {/* Lot Section */}
        <label>Lot :</label>
        {selectedLot ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-900">
                Lot #{selectedLot.id_lot}
              </p>
              <button
                className="text-xs text-blue-700 underline"
                onClick={() => setSelectedLot(null)}
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <button
            disabled={!selectedOffre}
            onClick={() => setIsLotModalOpen(true)}
            className={`px-4 py-2 rounded-md block  mb-4 text-white ${
              !selectedOffre ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
            }`}
          >
            Choisir un Lot
          </button>
        )}

        {/* Date Input + Submit */}
        <form onSubmit={handleSubmit}>
          <label>Date de la commande :</label>
          <input
            type="date"
            name="date_commande"
            value={form.date_commande}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200"
            required
          />
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
          >
            Enregistrer la commande
          </button>
        </form>
      </div>

      {isConsultModalOpen && (
        <ListeConsultationsModal
          setIsModalOpen={setIsConsultModalOpen}
          onSelectConsultation={handleConsultationSelect}
        />
      )}

      {isOffreModalOpen && (
        <ListeOffresModal
          setIsModalOpen={setIsOffreModalOpen}
          onSelectOffre={handleOffreSelect}
          filterByConsultation={selectedConsultation?.id_consultation}
        />
      )}

      {isLotModalOpen && (
        <ListeLotsModal
          setIsModalOpen={setIsLotModalOpen}
          onSelectLot={handleLotSelect}
          filterByOffre={selectedOffre?.id_offre}
        />
      )}
    </div>
  );
};

export default AjouterCommandeModal;
