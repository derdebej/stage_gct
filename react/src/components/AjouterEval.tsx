import React, { useState } from "react";
import { X } from "lucide-react";
import { OffreType } from "../types/OffreType";
import ListeOffresModal from "./ListeOffre";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterEvaluationModal = ({ setIsOpen, onEvaluationAdded }) => {
  const [selectedOffre, setSelectedOffre] = useState<OffreType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    id_offre: "",
    date: new Date().toISOString().split("T")[0],
    chemin_evaluation: "",
    conformite: "Conforme",
    id_fournisseur: "",
  });
  const handleOffreSelection = (offre: OffreType) => {
    setSelectedOffre(offre);
    setForm((prev) => ({
      ...prev,
      id_offre: offre.id_offre,
      id_fournisseur: offre.fournisseur?.id_fournisseur,
    }));
    setIsModalOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/evaluation-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'évaluation");

      const newEval = await res.json();
      onEvaluationAdded(newEval);
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
          Ajouter une évaluation
        </h2>
        <label>Offre Associée :</label>
        {selectedOffre ? (
          <div className="relative bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 text-sm text-blue-900 shadow-sm mt-1">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-md font-bold text-blue-900">
                  Offre #{selectedOffre.id_offre}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Fournisseur:</span>{" "}
                  {selectedOffre.fournisseur?.id_fournisseur}--{selectedOffre.fournisseur.nom}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Montant:</span>{" "}
                  {selectedOffre.montant}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Chemin Document:</span>{" "}
                  {selectedOffre.chemin_document}
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
                  onClick={() => setSelectedOffre(null)}
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
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mb-4 mt-1"
          >
            Choisir un Offre
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label>Date :</label>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
          />
          <label>Chemin Evaluation :</label>
          <input
            type="text"
            name="chemin_evaluation"
            placeholder="Chemin de l'évaluation (PDF, doc...)"
            value={form.chemin_evaluation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
          />
          <label>Conformité :</label>
          <select
            name="conformite"
            value={form.conformite}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
          >
            <option value="Conforme">Conforme</option>
            <option value="Non Conforme">Non Conforme</option>
          </select>
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
          >
            Enregistrer
          </button>
        </form>
      </div>
      {isModalOpen && (
        <ListeOffresModal
          setIsModalOpen={setIsModalOpen}
          onSelectOffre={handleOffreSelection}
        />
      )}
    </div>
  );
};

export default AjouterEvaluationModal;
