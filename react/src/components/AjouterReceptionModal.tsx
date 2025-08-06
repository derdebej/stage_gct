import React, { useState } from "react";
import { X } from "lucide-react";
import ListeCommandesModal from "./ListeCommandesModal";
import { CommandeType } from "../types/Comm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterReceptionModal = ({ setIsOpen, onReceptionAdded }) => {
  const [selectedCommande, setSelectedCommande] = useState<CommandeType | null>(null);
  const [isCommandeModalOpen, setIsCommandeModalOpen] = useState(false);

  const [form, setForm] = useState({
    id_commande: "",
    montant_recu: "",
    date_reception: new Date().toISOString().split("T")[0],
  });

  const handleCommandeSelect = (commande: CommandeType) => {
    setSelectedCommande(commande);
    setForm((prev) => ({
      ...prev,
      id_commande: commande.id_commande,
    }));
    setIsCommandeModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/reception-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la réception");

      const newReception = await res.json();
      onReceptionAdded(newReception);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter une réception
        </h2>

        {/* Commande selection */}
        <label>Commande :</label>
        {selectedCommande ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-900">
                Commande #{selectedCommande.id_commande}
              </p>
              <button
                onClick={() => {
                  setSelectedCommande(null);
                  setForm((prev) => ({ ...prev, id_commande: "" }));
                }}
                className="text-xs text-blue-700 underline"
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCommandeModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full mb-4"
          >
            Choisir une commande
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label>Montant reçu :</label>
          <input
            type="number"
            name="montant_recu"
            value={form.montant_recu}
            onChange={handleChange}
            required
            placeholder="Ex: 2500.00"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
          />

          <label>Date de réception :</label>
          <input
            type="date"
            name="date_reception"
            value={form.date_reception}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
          />

          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
          >
            Enregistrer la réception
          </button>
        </form>
      </div>

      {isCommandeModalOpen && (
        <ListeCommandesModal
          setIsModalOpen={setIsCommandeModalOpen}
          onSelectCommande={handleCommandeSelect}
        />
      )}
    </div>
  );
};

export default AjouterReceptionModal;
