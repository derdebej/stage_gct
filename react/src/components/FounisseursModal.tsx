import React, { useState, useEffect } from "react";
import { X, Search, FileUser } from "lucide-react";
import { Fournisseur } from "../types/fournisseur";
import AjouterFournisseurModal from "./AjouterFournisseurModal";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedFournisseur?: Dispatch<SetStateAction<Fournisseur | null>>;
};

const FounisseursModal = ({
  setIsModalOpen,
  setSelectedFournisseur,
}: Props) => {
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const handleSelect = (fournisseur: Fournisseur) => {
    setSelectedFournisseur?.(fournisseur);
    setIsModalOpen(false);
  };
  const handleFournisseurAdded = (newF) => {
    setFournisseurs((prev) => [...prev, newF]);
  };
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/fournisseurs?search=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        setFournisseurs(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFournisseurs();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Liste des fournisseurs
        </h2>
        <div className="flex items-center bg-white px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4 my-5 border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ID , Nom , Contact ... , "
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {fournisseurs.length > 0 ? (
            fournisseurs.map((fournisseur) => (
              <div
                onClick={() => handleSelect(fournisseur)}
                key={fournisseur.id_fournisseur}
                className="p-2 border-b border-gray-100 hover:bg-gray-50 hover:cursor-pointer"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {fournisseur.nom}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {fournisseur.id_fournisseur} • Email: {fournisseur.email}{" "}
                  • Numero tel: {fournisseur.num_tel}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500">Aucun résultat</p>
          )}
        </div>
        <button
          onClick={() => setIsAjouterOpen(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-xl mt-5"
        >
          <FileUser size={20} />
          Ajouter un fournisseur
        </button>
      </div>
      {isAjouterOpen && (
        <AjouterFournisseurModal
          setIsOpen={setIsAjouterOpen}
          onFournisseurAdded={handleFournisseurAdded}
        />
      )}
    </div>
  );
};

export default FounisseursModal;
