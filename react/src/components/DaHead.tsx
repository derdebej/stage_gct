import React from "react";
import { DA } from "../types/DA";
import { Search, Info, PlusCircle, FilePlus } from "lucide-react";
import { useState } from "react";
import Consultation from "./Consultation";
import AjouterDocument from "./AjouterDocument";
import DateFilter from "./DateFilter";

interface DaHeadProps {
  selectedRows: DA[];
  search: string;
  setSearch: (val: string) => void;
  etat: string;
  setEtat: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  month: string;
  setMonth: (val: string) => void;
  day: string;
  setDay: (val: string) => void;
}

const DaHead = ({
  selectedRows,
  search,
  setSearch,
  etat,
  setEtat,
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
}: DaHeadProps) => {
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
    const price = parseFloat(row.montant) || 0;
    return sum + price;
  }, 0);
  /*
  const totalLots = selectedRows.reduce((sum, row) => {
    return sum + row.nbre;
  }, 0);*/
  const [results, setResults] = useState<DA[]>([]);

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
          <button
            onClick={() => openAjouterDocument()}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm"
          >
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID , Titre , Demandeur ... , "
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <div className="flex justify-between gap-2">
          <DateFilter
            year={year}
            month={month}
            day={day}
            setYear={setYear}
            setMonth={setMonth}
            setDay={setDay}
          />
          <select
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm text-gray-700"
          >
            <option value="">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="terminee">Traité</option>
            <option value="en_cours">Non traité</option>
          </select>
        </div>
      </div>
      <Consultation
        totalPrice={totalPrice}
        totalLots={/*totalLots*/ 10}
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
        selectedRows={selectedRows}
      />

      <AjouterDocument
        isOpen={isAjouterDocumentOpen}
        onClose={closeAjouterDocument}
      />
    </>
  );
};

export default DaHead;
