import React from "react";
import { X } from "lucide-react";
import { DA } from "../types/DA";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  demande: DA | null;
};

const DemandeDetailsModal: React.FC<Props> = ({ isOpen, onClose, demande }) => {
  if (!isOpen || !demande) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b-1 border-gray-200">
          Détails de la demande
        </h2>

        <div className="space-y-2 text-sm">
          <div>
            <strong>ID :</strong> {demande.id_da}
          </div>
          <div>
            <strong>Titre :</strong> {demande.titre}
          </div>
          <div>
            <strong>Date :</strong> {new Date(demande.date).toLocaleDateString("fr-FR")}
          </div>
          <div>
            <strong>Nature :</strong> {demande.nature}
          </div>
          <div>
            <strong>Prix estimé :</strong> {demande.montant}
          </div>
          <div>
            <strong>Nature :</strong> {demande.nature}
          </div>
          <div>
            {demande.numaed && <><strong>N° AED :</strong> {demande.numaed}</>}
          </div>
          <div>
            {demande.objet && <><strong>Objet :</strong> {demande.objet}</>}
          </div>
          <div>
            <strong>Demandeur :</strong> {demande.demandeur}
          </div>
          <div>
            <strong>Statut :</strong> {demande.etat}
          </div>
          {demande.chemin_document && (
            <div>
              <strong>Fichier :</strong>{" "}
              <a
                href={demande.chemin_document}
                className="text-blue-600 underline"
                target="_blank"
              >
                Voir le document
              </a>
            </div>
          )}
          {/*<div>
            <strong>Articles :</strong>
            <ul className="list-disc pl-5">
              {demande.Articles.map((art, index) => (
                <li key={index}>
                  <strong>{art.designation}</strong> - {art.description} (Prix
                  unitaire: {art.prixUnitaire})
                </li>
              ))}
            </ul>
          </div>*/}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailsModal;
