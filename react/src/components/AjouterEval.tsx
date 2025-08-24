import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { consultationType } from "../types/consultationType";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { OffreType } from "../types/OffreType";
import ListeConsultationEval from "./ListeConsultationEval";
import { LotOffre } from "../types/LotOffre";
import { ArticleOffre } from "../types/ArticleOffre";
import { CircleCheckBig, PlusCircle } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type ItemWithOffres = (Lot | Art) & { offres: LotOffre[] | ArticleOffre[] };

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
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [file, setFile] = useState<File | null>(null);

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
                ? `${baseUrl}/api/articles/${(item as Art).id_article}/${
                    (item as Art).id_da
                  }/offres`
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

    if (!file) {
      setMessage("Veuillez uploader le document de l'offre.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
      return;
    }

     for (const item of items) {
      const itemId =
        selectedConsultation?.type === "consommable"
          ? `${(item as Art).id_article}-${(item as Art).id_da}`
          : (item as Lot).id_lot;

      for (const offre of item.offres) {
        if (!evaluations[itemId]?.[offre.id_offre]) {
          const errMessage = `Conformité manquante pour l'offre #${offre.id_offre} de l'article/lot ${itemId}`;
          setMessage(errMessage);
          setMessageType("error");
          setTimeout(() => {
            setMessage(null);
            setMessageType("");
          }, 3000);
          return;
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append(
        "id_consultation",
        selectedConsultation?.id_consultation.toString() || ""
      );
      formData.append("date", date);
      formData.append("file", file);
      formData.append("evaluations", JSON.stringify(evaluations));

      const res = await fetch(`${baseUrl}/api/evaluation-insert`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'évaluation");

      const newEval = await res.json();
      onEvaluationAdded(newEval);

      setMessage("Évaluation ajoutée avec succès !");
      setMessageType("success");
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'ajout de l'évaluation.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
    }
  };

  if (messageType === "success") {
    return (
      <div
        className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50`}
      >
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          <CircleCheckBig className="text-green-600" size={28} />
          {message}
        </div>
      </div>
    );
  }

  return (
    <>
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
                  ? `${(item as Art).id_article}-${(item as Art).id_da}`
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
                            Offre #{offre.id_offre} – {offre.nom || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Montant: {offre.montant}
                          </p>
                        </div>
                        <select
                          value={evaluations[itemId]?.[offre.id_offre] || ""}
                          onChange={(e) =>
                            handleEvaluationChange(
                              itemId,
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

          {selectedConsultation && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-10">
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
                    Uploader le document de l'offre
                  </label>
                  <label className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <PlusCircle />
                    {!file ? "Choisir un fichier PDF" : `${file.name}`}
                  </label>
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
        {messageType === "error" && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg bg-red-100 text-red-800 border border-red-300">
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default AjouterEvaluationModal;
