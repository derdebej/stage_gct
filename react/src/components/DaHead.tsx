import React from "react";
import { DA } from "../types/DA";
import { Search, Info, PlusCircle, FilePlus } from "lucide-react";
import { useState } from "react";
import Consultation from "./Consultation";
import AjouterDocument from "./AjouterDocument";

interface DaHeadProps {
  selectedRows: DA[];
}

const DaHead = ({ selectedRows }: DaHeadProps) => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAjouterDocumentOpen, setIsAjouterDocumentOpen] = useState(false);

  const openAjouterDocument = () => {
    setIsAjouterDocumentOpen(true);
  };
  const closeAjouterDocument = () => {
    setIsAjouterDocumentOpen(false);
  };

  const openConsultation = () => {
    setIsConsultationOpen(true);
  };
  const closeConsultation = () => {
    setIsConsultationOpen(false);
  };
  const totalPrice = selectedRows.reduce((sum, row) => {
    const price = parseFloat(row.montant_estime.replace(" dt", "")) || 0;
    return sum + price;
  }, 0);

  const totalLots = selectedRows.reduce((sum, row) => {
    return sum + row.nbre;
  }, 0);

  return (
    <>
      <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Demandes d'achats
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => openConsultation()}
            className={`text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm ${
              selectedRows.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900"
            }`}
            disabled={selectedRows.length === 0}
          >
            <PlusCircle className="w-4 h-4" />
            Regrouper en une Consultation
          </button>
          <button onClick={()=>openAjouterDocument()} className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm">
            <FilePlus className="w-4 h-4" />
            Ajouter une Demande d'Achat
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par ID , Titre , Demandeur ... , "
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <div>
          <select className="border rounded-md px-3 py-1 text-sm text-gray-700 mr-5">
            <option value="janvier">Janvier</option>
            <option value="février">Février</option>
            <option value="mars">Mars</option>
            <option value="avril">Avril</option>
            <option value="mai">Mai</option>
            <option value="juin">Juin</option>
            <option value="juillet">Juillet</option>
            <option value="août">Août</option>
            <option value="septembre">Septembre</option>
            <option value="octobre">Octobre</option>
            <option value="novembre">Novembre</option>
            <option value="décembre">Décembre</option>
          </select>
          <select className="border rounded-md px-3 py-1 text-sm text-gray-700">
            <option value="Traité">Traité</option>
            <option value="En Attente">En Attente</option>
            <option value="Non Traité">Non Traité</option>
          </select>
        </div>
      </div>
      <Consultation
        totalPrice={totalPrice}
        totalLots={totalLots}
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
        selectedRows={selectedRows}
      />
      
      <AjouterDocument
        isOpen={isAjouterDocumentOpen}
        onClose={closeAjouterDocument}/>
    </>
  );
};

export default DaHead;
