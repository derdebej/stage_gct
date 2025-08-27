import React, { useState, useEffect } from "react";
import { X, CircleCheckBig } from "lucide-react";
import ListeConsultationsModal from "./ListeConsultationsModal";
import { consultationType } from "../types/consultationType";
import { OffreType } from "../types/OffreType";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { LotOffre } from "../types/LotOffre";
import { ArticleOffre } from "../types/ArticleOffre";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AjouterCommandeModal = ({ setIsOpen, onCommandeAdded }) => {
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [items, setItems] = useState<(Lot | Art)[]>([]);
  const [bestOffers, setBestOffers] = useState<
    Record<string, OffreType | LotOffre | ArticleOffre | null>
  >({});
  const [dateCommande, setDateCommande] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [commandeId, setCommandeId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedConsultation) return;

    const fetchItems = async () => {
      try {
        const itemsRes = await fetch(
          `${baseUrl}/api/consultations/${selectedConsultation.id_consultation}/items`
        );
        const rawItems = await itemsRes.json();

        const withOffres = await Promise.all(
          rawItems.map(async (item: Lot | Art) => {
            const route =
              selectedConsultation.type === "consommable"
                ? `${baseUrl}/api/articles/${(item as Art).id_article}/${
                    (item as Art).id_da
                  }/offresConforme`
                : `${baseUrl}/api/lots/${(item as Lot).id_lot}/offresConforme`;

            const offresRes = await fetch(route);
            const offres: (LotOffre | ArticleOffre)[] = await offresRes.json();
            console.log("Fetched offres for item:", item, offres);
            const conformes = offres;
            const best =
              conformes.length > 0
                ? conformes.reduce(
                    (min, o) => (o.montant < min.montant ? o : min),
                    conformes[0]
                  )
                : null;

            setBestOffers((prev) => ({
              ...prev,
              [selectedConsultation.type === "consommable"
                ? `${(item as Art).id_article}-${(item as Art).id_da}`
                : (item as Lot).id_lot]: best,
            }));

            return { ...item, offres };
          })
        );

        setItems(withOffres);
      } catch (err) {
        console.error("Erreur chargement items", err);
      }
    };

    fetchItems();
  }, [selectedConsultation]);

  const handleConfirm = async () => {
    if (!commandeId){
      setError("L'ID de la commande est requis.");
      return;
    }
    try {
      const commandesParFournisseur: Record<
        string,
        { id_fournisseur: string; items: any[] }
      > = {};

      for (const item of items) {
        const itemId =
          selectedConsultation?.type === "consommable"
            ? `${(item as Art).id_article}-${(item as Art).id_da}`
            : (item as Lot).id_lot;
        const ItemDa =
          selectedConsultation?.type === "consommable"
            ? (item as Art).id_da
            : (item as Lot).id_da;

        const offre = bestOffers[itemId];
        if (!offre) continue;

        const fournisseurId = offre.id_fournisseur;
        if (!commandesParFournisseur[fournisseurId]) {
          commandesParFournisseur[fournisseurId] = {
            id_fournisseur: fournisseurId,
            items: [],
          };
        }
        commandesParFournisseur[fournisseurId].items.push({
          id_offre: offre.id_offre,
          id_item: itemId,
          id_da: ItemDa,
        });
      }
      for (const f of Object.values(commandesParFournisseur)) {
        const res = await fetch(`${baseUrl}/api/commande-insert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_commande: commandeId,
            id_consultation: selectedConsultation?.id_consultation,
            id_fournisseur: f.id_fournisseur,
            date_commande: dateCommande,
            items: f.items,
          }),
        });

        if (!res.ok) throw new Error("Erreur ajout commande");
        const newCmd = await res.json();
        onCommandeAdded(newCmd);
      }
      setMessage("Commandes créées avec succès.");
      setMessageType("success");
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la création des commandes.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
    }
  };
  if (message) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          {messageType === "success" ? (
            <CircleCheckBig className="text-green-600" size={28} />
          ) : (
            <X className="text-red-600" size={28} />
          )}
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter une commande
        </h2>

        {selectedConsultation ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
            <div className="flex justify-between items-center">
              <p>
                Consultation #{selectedConsultation.id_consultation} –{" "}
                {selectedConsultation.type}
              </p>
              <button
                className="text-sm text-red-500 underline"
                onClick={() => setSelectedConsultation(null)}
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsConsultModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md mb-4"
          >
            Choisir une Consultation
          </button>
        )}

        {selectedConsultation && (
          <>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                ID Consultation
              </label>
              <input
                value={commandeId}
                onChange={(e) => setCommandeId(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: CST2025"
              />
            </div>
            <div className="px-3 max-h-80 overflow-y-auto will-change-transform">
              {items.map((item) => {
                const itemId =
                  selectedConsultation.type === "consommable"
                    ? `${(item as Art).id_article}-${(item as Art).id_da}`
                    : (item as Lot).id_lot;
                const title =
                  selectedConsultation.type === "consommable"
                    ? `Article #${(item as Art).id_article} – ${
                        (item as Art).designation
                      } Qté: ${(item as Art).quantite}`
                    : `Lot #${(item as Lot).id_lot} – DA: ${
                        (item as Lot).id_da
                      }`;
                const offre = bestOffers[itemId];

                return (
                  <div
                    key={itemId}
                    className="border border-blue-200 rounded-md my-3 p-3 bg-blue-50"
                  >
                    <p className="font-semibold text-blue-900">{title}</p>
                    {offre ? (
                      <p className="text-sm text-green-700">
                        Offre #{offre.id_offre} – ID fournisseur :
                        {offre.id_fournisseur} (Montant:{" "}
                        {(offre as LotOffre | ArticleOffre).montant})
                      </p>
                    ) : (
                      <p className="text-sm text-red-600">
                        Aucune offre conforme reçue
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {selectedConsultation && (
          <div className="mt-6 space-y-4">
            <label>Date de la commande :</label>
            <input
              type="date"
              value={dateCommande}
              onChange={(e) => setDateCommande(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            <button
              onClick={handleConfirm}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
            >
              Confirmer et créer les commandes
            </button>
          </div>
        )}

        {isConsultModalOpen && (
          <ListeConsultationsModal
            setIsModalOpen={setIsConsultModalOpen}
            onSelectConsultation={setSelectedConsultation}
          />
        )}
      </div>
    </div>
  );
};

export default AjouterCommandeModal;
