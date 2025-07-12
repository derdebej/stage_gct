import React from "react";
import { X } from "lucide-react";


interface AjouterDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AjouterDocument = ({ isOpen, onClose }: AjouterDocumentProps) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close ajouter document modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter un document
        </h2>
        <p className="text-gray-600 mb-4">
          Sélectionnez un fichier pdf à ajouter à la demande d'achat.
        </p>
        {/* Form for adding a document can be added here */}
        <label className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log("Fichier sélectionné :", file.name);
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter un document
        </label>
        
      </div>
    </div>
  );
};

export default AjouterDocument;
