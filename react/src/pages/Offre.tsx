import React, { useState } from "react";
import TableOffre from "../components/TableOffre";
import { Search, FilePlus, List } from "lucide-react";
import FounisseursModal from "../components/FounisseursModal";

const Offre = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="mb-6 flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <h2 className="text-xl font-bold ">Liste des Offres</h2>
        <div className="flex gap-2">
          <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm">
            <FilePlus className="w-4 h-4" />
            Ajouter une Offre
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm"
          >
            <List className="w-4 h-4" />
            Consulter la liste des fournisseurs
          </button>
        </div>
      </div>
      <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Rechercher par ID, Fournisseur, Date de Soumission..."
          className="bg-transparent outline-none w-full text-sm text-gray-700"
        />
      </div>
      <TableOffre />
      {isModalOpen && <FounisseursModal setIsModalOpen={setIsModalOpen}/>}
    </div>
  );
};

export default Offre;
