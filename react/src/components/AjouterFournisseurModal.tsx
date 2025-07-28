import React, { useState } from "react";
import { X } from "lucide-react";

const AjouterFournisseurModal = ({ setIsOpen, onFournisseurAdded }) => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    num_tel: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/ajouter-fournisseur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");

      const newFournisseur = await res.json();
      onFournisseurAdded(newFournisseur);
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
        <h2 className="text-xl font-bold text-blue-900 mb-4">Ajouter un fournisseur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="num_tel"
            placeholder="Numéro de téléphone"
            value={form.num_tel}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterFournisseurModal;
