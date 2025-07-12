import React from "react";
import TableEval from "../components/TableEval";
import { FilePlus , Search} from "lucide-react";

const Evaluation = () => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="mb-6 flex justify-between items-center border-b-2 border-gray-200 pb-4">
          <h2 className="text-xl font-bold">Liste des Evaluations</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1  bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm">
              <FilePlus className="w-4 h-4" />
              Ajouter une Evaluation
            </button>
          </div>
        </div>
        <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1  border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par ID, Offre, Date, Montant..."
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <TableEval data={[
          {
            id: "123",
            fournisseur: "Fournisseur A",
            IdOffre: "OFF20250701-01",
            date: "2025-07-01",
            montant: 12850.5,
            IdConsultation: "309877",
            CheminEvaluation: "/evaluation/eval1.pdf",
            statut: "Conforme",
          },
          {
            id: "124",
            fournisseur: "Fournisseur A",
            IdOffre: "OFF20250701-02",
            date: "2025-07-01",
            montant: 7900,
            IdConsultation: "259877",
            CheminEvaluation: "/evaluation/eval2.pdf",
            statut: "Non Conforme",
          },
          {
            id: "125",
            fournisseur: "Fournisseur A",
            IdOffre: "OFF20250701-03",
            date: "2025-07-01",
            montant: 15500,
            IdConsultation: "209877",
            CheminEvaluation: "/evaluation/eval3.pdf",
            statut: "Conforme",
          } 
        ]} />
      </div>
    </>
  );
};

export default Evaluation;
