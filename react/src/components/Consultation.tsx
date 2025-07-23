import React from "react";
import { X } from "lucide-react";
import { DA } from "../types/DA";
import { useState } from "react";

interface ConsultationProps {
  totalPrice: number;
  totalLots: number;
  isOpen: boolean;
  onClose: () => void;
  selectedRows: DA[];
}

const Consultation = ({
  totalPrice,
  totalLots,
  isOpen,
  onClose,
  selectedRows,
}: ConsultationProps) => {
  if (!isOpen) return null;
  const [error, setError] = useState("")

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
          Consultation
        </h2>

        <div className="space-y-4">
          <h1 className="text-center text-2xl font-semibold text-gray-800">
            Les demandes d'achats sélectionnées :
          </h1>
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Titre</th>
                <th className="py-2 px-4 text-left text-gray-600">Montant</th>
              </tr>
            </thead>
            <tbody>
              {selectedRows.map((row) => (
                <tr key={row.id_da} className="border-b  border-gray-200">
                  <td className="py-2 px-4 text-gray-700">{row.titre}</td>
                  <td className="py-2 px-4 text-gray-700">{row.montant} dt</td>
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
          <div>ID Consultation:</div>
          <input placeholder="id consultation" className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}/>
          <div className=" flex justify-between mt-6 text-right">
            <button 
              onClick={onClose}
              
            className="px-4 py-2  text-blue-800 border-2 border-blue-900 rounded-md bg-white hover:bg-blue-900 hover:text-white">
              Fermer
            </button>
            <button className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900 ">
              Creer une Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
