import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Link } from "react-router-dom";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";
import { consultationType } from "../types/consultationType";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_PDF_PATH = import.meta.env.VITE_BASE_PDF_PATH;

//import "react-pdf/dist/esm/Page/AnnotationLayer.css";
//import "react-pdf/dist/esm/Page/TextLayer.css";

//pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  demande: DA | null;
};

const DemandeDetailsModal: React.FC<Props> = ({ isOpen, onClose, demande }) => {
  const [relatedLots, setRelatedLots] = useState<Lot[]>([]);
  const [relatedConsultation, setRelatedConsultation] =
    useState<consultationType | null>(null);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!demande || demande.etat === "Non Traitée") return;

      try {
        const res = await fetch(`${baseUrl}/api/demande-related`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: demande.id_da }),
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération");

        const data = await res.json();
        setRelatedLots(data.lot);
        setRelatedConsultation(data.consultation);
      } catch (err) {
        console.error("Erreur dans fetch:", err);
      }
    };

    fetchRelatedData();
  }, [demande]);

  if (!isOpen || !demande) return null;

  const {
    id_da,
    titre,
    date,
    nature,
    montant,
    numaed,
    objet,
    demandeur,
    etat,
    chemin_document,
  } = demande;

  //const pdfPath = `${BASE_PDF_PATH}/${encodeURIComponent(chemin_document)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-blue-900 text-center border-b pb-4 mb-4">
          Détails de la Demande d'Achat
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Details Section */}
          <div className="flex-1 space-y-2 text-sm">
            <p>
              <strong className="text-blue-900">ID :</strong> {id_da}
            </p>
            <p>
              <strong className="text-blue-900">Titre :</strong> {titre}
            </p>
            <p>
              <strong className="text-blue-900">Date :</strong>{" "}
              {new Date(date).toLocaleDateString("fr-FR")}
            </p>
            <p>
              <strong className="text-blue-900">Nature :</strong> {nature}
            </p>
            <p>
              <strong className="text-blue-900">Prix estimé :</strong> {montant}
            </p>
            {numaed && (
              <p>
                <strong className="text-blue-900">N° AED :</strong> {numaed}
              </p>
            )}
            {objet && (
              <p>
                <strong className="text-blue-900">Objet :</strong> {objet}
              </p>
            )}
            <p>
              <strong className="text-blue-900">Demandeur :</strong> {demandeur}
            </p>
            <p>
              <strong className="text-blue-900">Statut :</strong> {etat}
            </p>

            {etat !== "Non Traitée" && (
              <>
                {/* Consultation in card format */}
                {relatedConsultation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-2">
                    <div className="relative bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900">
                      <p>
                        <span className="font-semibold">ID Consultation:</span>{" "}
                        {relatedConsultation.id_consultation}
                      </p>
                      <p>
                        <span className="font-semibold">Date Création:</span>{" "}
                        {new Date(
                          relatedConsultation.date_creation
                        ).toLocaleDateString("fr-FR")}
                      </p>
                      <p>
                        <span className="font-semibold">Nombre de Lots:</span>{" "}
                        {relatedConsultation.nombre_des_lots}
                      </p>
                      <Link
                        to="/consultation"
                        state={{ consultation: relatedConsultation }}
                        className=" text-blue-600 text-xs underline"
                      >
                        Voir plus
                      </Link>
                    </div>
                  </div>
                )}

                {/* Lot card */}
                {relatedLots && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-2">
                    {relatedLots.map((relatedLot, index) => (
                      <div
                        key={index}
                        className="relative bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900"
                      >
                        <p>
                          <span className="font-semibold">ID Lot:</span>{" "}
                          {relatedLot.id_lot}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* PDF Viewer */}
          {/*
          {chemin_document && (
            <div className="flex-1 border p-3 rounded-md bg-gray-50">
              {pdfPath}
              <Document
                file={pdfPath}
                onLoadError={(err) => console.error("Erreur PDF:", err)}
                loading={<p>Chargement du document PDF...</p>}
                noData={<p>Aucun document disponible.</p>}
              >
                <Page pageNumber={1} scale={0.6} />
              </Document>
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-600 text-sm underline"
              >
                Ouvrir dans un nouvel onglet
              </a>
            </div>
          )}*/}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailsModal;
