import React, { useState } from "react";
import { X, CircleCheckBig } from "lucide-react";
import { DA } from "../types/DA";
const baseUrl = import.meta.env.VITE_API_BASE_URL;



interface ConsultationProps {
  totalPrice: number;
  totalLots: number;
  isOpen: boolean;
  onClose: () => void;
  selectedRows: DA[];
  setSelectedRows: any;
  onRefresh: any;
}

const Consultation = ({
  totalPrice,
  isOpen,
  onClose,
  selectedRows,
  setSelectedRows,
  onRefresh,
}: ConsultationProps) => {
  if (!isOpen) return null;

  const [consultationId, setConsultationId] = useState("");
  const [nombreLots, setNombreLots] = useState("");
  const [error, setError] = useState("");
  const [lots, setLots] = useState(
    selectedRows.map((row) => ({ id_da: row.id_da, id_lot: "" }))
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userid = user?.id_utilisateur;

  const handleCreateConsultation = async () => {
    if (!consultationId || !nombreLots || lots.some((lot) => !lot.id_lot)) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl}/api/enrigistrer-consultation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_consultation: consultationId,
            nombre_lots: Number(nombreLots),
            date_creation: new Date().toISOString(),
            userid,
            lots: lots.map((lot) => ({
              id_lot: Number(lot.id_lot),
              id_da: lot.id_da,
            })),
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la création");

      setMessage("Consultation regroupée avec succès");
      setMessageType("success");
      setSelectedRows([]);
      setLots([]);
      setConsultationId("");
      setNombreLots("");
      setError("");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
        onRefresh();
        onClose();
      }, 2000);
    } catch (err) {
      setMessage("Échec de la création de la consultation");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      {message && (
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          {messageType === "success" ? (
            <CircleCheckBig className="text-green-600" size={28} />
          ) : (
            <X className="text-red-600" size={28} />
          )}
          {message}
        </div>
      )}

      {!message && (
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Créer une Consultation
          </h2>

          <div className="grid gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                ID Consultation
              </label>
              <input
                value={consultationId}
                onChange={(e) => setConsultationId(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: CST2025"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Nombre de Lots
              </label>
              <input
                value={nombreLots}
                onChange={(e) => setNombreLots(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: 3"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Titre</th>
                  <th className="px-4 py-2 text-left text-gray-600">Montant</th>
                  <th className="px-4 py-2 text-left text-gray-600">N° Lot</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row, index) => (
                  <tr key={row.id_da} className="border-b border-gray-100">
                    <td className="px-4 py-2">{row.titre}</td>
                    <td className="px-4 py-2">{row.montant} dt</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={lots[index].id_lot}
                        onChange={(e) => {
                          const updated = [...lots];
                          updated[index].id_lot = e.target.value;
                          setLots(updated);
                        }}
                        className={`w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Ex: 1"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td className="px-4 py-2 font-semibold text-gray-700">
                    Montant Total
                  </td>
                  <td className="px-4 py-2">{totalPrice} dt</td>
                </tr>
              </tbody>
            </table>
          </div>

          {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition"
            >
              Fermer
            </button>
            <button
              onClick={handleCreateConsultation}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
            >
              Regrouper en une Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
