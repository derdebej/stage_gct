import React from "react";
import { X } from "lucide-react";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";
import { consultationType } from "../types/consultationType";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  consultation: consultationType | null;
  relatedDemandes: DA[];
  relatedLots: Lot[];
};

const ConsultationDetails: React.FC<Props> = ({
  isOpen,
  onClose,
  consultation,
  relatedDemandes,
  relatedLots,
}) => {
  if (!isOpen || !consultation) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b-1 border-gray-200">
          Détails de la consultation
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <strong>ID Consultation :</strong> {consultation.id_consultation}
          </div>
          <div>
            <strong>Date de création :</strong>{" "}
            {new Date(consultation.date_creation).toLocaleDateString("fr-FR")}
          </div>
          <div>
            <strong>Nombre de lots :</strong> {consultation.nombre_des_lots}
          </div>
        </div>
        <h3 className="font-bold text-lg text-blue-800 border-b pb-2 mt-6">
          Demande d'Achat liée
        </h3>
        <div className="max-h-40 overflow-y-auto pr-2 ">
          {relatedDemandes &&
            relatedDemandes.map((relatedDemande, index) => (
              <div key={index} className="mt-6">
                <div className="space-y-2 text-sm pb-6 border-b border-neutral-300">
                  <div>
                    <strong>ID DA :</strong> {relatedDemande.id_da}
                  </div>
                  <div>
                    <strong>Titre :</strong> {relatedDemande.titre}
                  </div>
                  <div>
                    <strong>Date :</strong>{" "}
                    {new Date(relatedDemande.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <strong>Montant estimé :</strong> {relatedDemande.montant}{" "}
                    TND
                  </div>
                  <div>
                    <strong>Statut :</strong> {relatedDemande.etat}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {relatedLots.length > 0 && (
          <>
            <h3 className="mt-6 font-bold text-lg text-blue-800 border-b pb-2">
              Lots associés
            </h3>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
              {relatedLots.map((lot, index) => (
                <li key={index}>
                  <strong>ID Lot:</strong> {lot.id_lot} —{" "}
                  <strong>ID DA:</strong> {lot.id_da}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white rounded-md bg-blue-800 hover:bg-blue-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
