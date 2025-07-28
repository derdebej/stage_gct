import React, { useState } from "react";
import { X } from "lucide-react";

const ModifyDemandeAchat = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      id_da: "",
      demandeur: "",
      titre: "",
      date: "",
      chemin_document: "",
      nature: "",
      objet: "",
      numaed: "",
      montant: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative  overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close ajouter document modal"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Modifier une demande d'achat
        </h2>

        <div className="space-y-2">
          <label className="block text-md text-gray-700">ID</label>
          <input
            name="id_da"
            value={form.id_da}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">
            Montant total (dt)
          </label>
          <input
            name="montant"
            value={form.montant}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">Demandeur</label>
          <input
            name="demandeur"
            value={form.demandeur}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">Titre</label>
          <input
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">Date</label>
          <input
            name="date"
            type="date"
            value={form.date.split("T")[0]}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">
            Chemin du document
          </label>
          <input
            name="chemin_document"
            value={form.chemin_document}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">Nature</label>
          <select
            name="nature"
            value={form.nature}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="Exploitation">Exploitation</option>
            <option value="Investissement">Investissement</option>
          </select>
          {form.nature == "Investissement" && (
            <>
              <label className="block text-md text-gray-700">Objet</label>
              <input
                name="objet"
                value={form.objet}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <label className="block text-md text-gray-700">Numéro AED</label>
              <input
                name="numaed"
                value={form.numaed}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </>
          )}
        </div>

        <div className=" flex justify-between mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2  text-blue-800 border-2 border-blue-900 rounded-md bg-white hover:bg-blue-900 hover:text-white"
          >
            Fermer
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900 "
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyDemandeAchat;
