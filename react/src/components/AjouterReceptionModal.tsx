import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ListeCommandesModal from "./ListeCommandesModal";
import { CommandeType } from "../types/Comm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterReceptionModal = ({ setIsOpen, onReceptionAdded }) => {
  const [selectedCommande, setSelectedCommande] = useState<CommandeType | null>(
    null
  );
  const [isCommandeModalOpen, setIsCommandeModalOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    id_commande: "",
    date_reception: new Date().toISOString().split("T")[0],
  });
  const handleCommandeSelect = async (commande: CommandeType) => {
    setSelectedCommande(commande);
    setForm((prev) => ({ ...prev, id_commande: commande.id_commande }));
    setIsCommandeModalOpen(false);

    try {
      const res = await fetch(
        `${baseUrl}/api/commandes/${commande.id_commande}/details`
      );
      if (!res.ok)
        throw new Error("Erreur lors du chargement des détails de la commande");
      const data = await res.json();
      console.log("Commande items:", data.lots);

      let items = [];
      if (data.articles?.length > 0) items = data.articles;
      else if (data.lots?.length > 0) items = data.lots;
      setItems(items);

    } catch (err) {
      console.error(err);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        items,
      };
      console.log("Submitting payload:", payload);

      const res = await fetch(`${baseUrl}/api/receptions-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter une réception
        </h2>

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
                  setItems([]);
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

        {selectedCommande && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label>Date de réception :</label>
            <input
              type="date"
              name="date_reception"
              value={form.date_reception}
              onChange={(e) =>
                setForm({ ...form, date_reception: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-200 mt-1"
            />

            <div className="mt-4">
              {items.length > 0 ? (
                <table className="w-full border text-sm text-gray-800">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="p-2 border">Article / Lot</th>
                      {selectedCommande.type === "consommable" ? (
                        <>
                          <th className="p-2 border">Quantité commandée</th>
                          <th className="p-2 border">Quantité reçue</th>
                        </>
                      ) : (
                        <th className="p-2 border">Reçu</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border p-2">
                          {selectedCommande.type === "consommable"
                            ? item.designation
                            : item.id_lot}
                        </td>
                        {selectedCommande.type === "consommable" ? (
                          <>
                            <td className="border p-2">{item.quantite}</td>
                            <td className="border p-2">
                              <input
                                type="number"
                                min="0"
                                max={item.quantite_commande}
                                value={item.quantite_recue || 0}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "quantite_recue",
                                    e.target.value
                                  )
                                }
                                className="w-20 border rounded px-2"
                              />
                            </td>
                          </>
                        ) : (
                          <td className="border p-2">
                            <input
                              type="checkbox"
                              checked={item.recu || false}
                              onChange={(e) =>
                                handleItemChange(idx, "recu", e.target.checked)
                              }
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Aucun article/lot trouvé
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
            >
              Enregistrer la réception
            </button>
          </form>
        )}
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
