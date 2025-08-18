import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { consultationType } from "../types/consultationType";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { OffreType } from "../types/OffreType";
import ListeConsultationEval from "./ListeConsultationEval";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type ItemWithOffres = (Lot | Art) & { offres: OffreType[] };

const AjouterEvaluationModal = ({ setIsOpen, onEvaluationAdded }) => {
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [items, setItems] = useState<ItemWithOffres[]>([]);
  const [evaluations, setEvaluations] = useState<
    Record<string, Record<string, string>>
  >({});

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cheminEval, setCheminEval] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedConsultation) return;

      try {
        const itemsRes = await fetch(
          `${baseUrl}/api/consultations/${selectedConsultation.id_consultation}/items`
        );
        const rawItems = await itemsRes.json();

        const itemsWithOffres = await Promise.all(
          rawItems.map(async (item: Lot | Art) => {
            const offreRoute =
              selectedConsultation.type === "consommable"
                ? `${baseUrl}/api/articles/${(item as Art).id_article}/offres`
                : `${baseUrl}/api/lots/${(item as Lot).id_lot}/offres`;

            const offresRes = await fetch(offreRoute);
            const offres = await offresRes.json();

            return { ...item, offres };
          })
        );

        setItems(itemsWithOffres);
      } catch (err) {
        console.error("Erreur lors du chargement des items", err);
      }
    };

    fetchItems();
  }, [selectedConsultation]);

  const handleEvaluationChange = (
    itemId: string,
    offreId: string,
    conformite: string
  ) => {
    setEvaluations((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [offreId]: conformite,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const item of items) {
      const itemId =
        selectedConsultation?.type === "consommable"
          ? (item as Art).id_article
          : (item as Lot).id_lot;

      for (const offre of item.offres) {
        if (!evaluations[itemId]?.[offre.id_offre]) {
          alert(
            `Veuillez sélectionner la conformité pour l'offre #${offre.id_offre}`
          );
          return;
        }
      }
    }
    try {
      const payload = {
        id_consultation: selectedConsultation?.id_consultation,
        date,
        chemin_evaluation: cheminEval,
        evaluations,
      };

      const res = await fetch(`${baseUrl}/api/evaluation-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'évaluation");

      const newEval = await res.json();
      onEvaluationAdded(newEval);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">
          Ajouter une évaluation
        </h2>

        {/* Consultation selection */}
        {!selectedConsultation ? (
          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-3 rounded-md mb-6 transition-colors"
          >
            Choisir une Consultation
          </button>
        ) : (
          <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div>
              <p className="font-semibold text-blue-900">
                Consultation #{selectedConsultation.id_consultation}
              </p>
              <span className="text-sm text-gray-600 px-2 py-1 bg-blue-100 rounded-md">
                {selectedConsultation.type}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedConsultation(null);
                setItems([]);
              }}
              className="text-red-500 underline text-sm"
            >
              Changer
            </button>
          </div>
        )}

        {/* Items + Offres */}
        <div className="space-y-4">
          {items.map((item) => {
            const itemId =
              selectedConsultation?.type === "consommable"
                ? (item as Art).id_article
                : (item as Lot).id_lot;
            const title =
              selectedConsultation?.type === "consommable"
                ? `Article #${(item as Art).id_article} – ${
                    (item as Art).designation
                  }`
                : `Lot #${(item as Lot).id_lot} – DA: ${(item as Lot).id_da}`;

            return (
              <div
                key={itemId}
                className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4"
              >
                <h3 className="font-semibold text-blue-900 mb-3">{title}</h3>
                <div className="space-y-2">
                  {item.offres.map((offre) => (
                    <div
                      key={offre.id_offre}
                      className="flex justify-between items-center bg-white border border-blue-200 p-2 rounded-md"
                    >
                      <div>
                        <p className="text-gray-700">
                          Offre #{offre.id_offre} –{" "}
                          {offre.fournisseur?.nom || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Montant: {offre.montant}
                        </p>
                      </div>
                      <select
                        value={evaluations[itemId]?.[offre.id_offre] || ""}
                        onChange={(e) =>
                          handleEvaluationChange(
                            String(itemId),
                            String(offre.id_offre),
                            e.target.value
                          )
                        }
                        className="border rounded-md px-3 py-1 border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="">Choisir</option>
                        <option value="Conforme">Conforme</option>
                        <option value="Non Conforme">Non Conforme</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer form */}
        {selectedConsultation && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Chemin Evaluation
                </label>
                <input
                  type="text"
                  value={cheminEval}
                  onChange={(e) => setCheminEval(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Ex: /path/to/file.pdf"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-3 rounded-md w-full transition-colors"
            >
              Enregistrer
            </button>
          </form>
        )}

        {isConsultationModalOpen && (
          <ListeConsultationEval
            setIsModalOpen={setIsConsultationModalOpen}
            onSelectConsultation={setSelectedConsultation}
          />
        )}
      </div>
    </div>
  );
};

export default AjouterEvaluationModal;
