import React from "react";
import { Divide, Heading1, X } from "lucide-react";
import { DA } from "../types/DA";
import { useState } from "react";
import { CircleCheckBig } from "lucide-react";

interface ConsultationProps {
  totalPrice: number;
  totalLots: number;
  isOpen: boolean;
  onClose: () => void;
  selectedRows: DA[];
  setSelectedRows;
  onRefresh;
}

const Consultation = ({
  totalPrice,
  totalLots,
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
    selectedRows.map((row) => ({
      id_da: row.id_da,
      id_lot: "",
    }))
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userid = user?.id_utilisateur;

  const handleCreateConsultation = async () => {
    if (!consultationId || !nombreLots || lots.some((lot) => !lot.id_lot)) {
      setError("Tous les champs sont requis");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3001/api/enrigistrer-consultation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_consultation: consultationId,
            nombre_lots: Number(nombreLots),
            date_creation: new Date().toISOString(),
            userid: userid,
            lots: lots.map((lot) => ({
              id_lot: Number(lot.id_lot),
              id_da: lot.id_da,
            })),
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la création");

      const data = await res.json();
      console.log("Consultation créée:", data);
      setMessage("Consultation regroupé avec succés");
      setMessageType("success");
      setSelectedRows([]);
      setLots([]);
      setConsultationId("");
      setNombreLots("");
      setError("");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
        onRefresh()
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError("Échec de la création de la consultation.");
      setMessage("Échec de la création de la consultation");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {message && (
        <div className="flex items-center gap-2 bg-white text-xl text-gray-600 rounded-xl py-10 px-15">
          {message} {messageType == "success" ? <CircleCheckBig size={30}/> : <X size={30} />}
        </div>
      )}
      {!message && (
        <>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close consultation modal"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
              Consultation
            </h2>
            <h1 className="text-left text-2xl font-semibold text-gray-800">
              Créer une Consultation:
            </h1>
            <label>ID Consultation:</label>
            <input
              placeholder="id consultation"
              value={consultationId}
              onChange={(e) => setConsultationId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label>Nombre de lots:</label>
            <input
              placeholder="nombre de lots"
              value={nombreLots}
              onChange={(e) => setNombreLots(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />

            <div className="space-y-4">
              <table className="w-full text-sm text-gray-700 border-2 border-gray-200 mt-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left text-gray-600">Titre</th>
                    <th className="py-2 px-4 text-left text-gray-600">
                      Montant
                    </th>
                    <th className="py-2 px-4 text-left text-gray-600">
                      N° Lot Consultation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRows.map((row, index) => (
                    <tr key={row.id_da} className="border-b  border-gray-200">
                      <td className="py-2 px-4 text-gray-700">{row.titre}</td>
                      <td className="py-2 px-4 text-gray-700">
                        {row.montant} dt
                      </td>
                      <td className="py-2 px-4 text-gray-700">
                        <input
                          type="text"
                          value={lots[index].id_lot}
                          onChange={(e) => {
                            const updated = [...lots];
                            updated[index].id_lot = e.target.value;
                            setLots(updated);
                          }}
                          className={`w-full px-4 py-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td className="py-2 px-4 text-gray-700 font-semibold border-b  border-gray-200">
                      Montant Total
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="py-2 px-4 text-gray-700 border-b border-gray-200 ">
                      {totalPrice} dt
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-red-500">{error}</div>

              <div className=" flex justify-between mt-6 text-right">
                <button
                  onClick={onClose}
                  className="px-4 py-2  text-blue-800 border-2 border-blue-900 rounded-md bg-white hover:bg-blue-900 hover:text-white"
                >
                  Fermer
                </button>
                <button
                  onClick={handleCreateConsultation}
                  className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900 "
                >
                  Regrouper en une Consultation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Consultation;
