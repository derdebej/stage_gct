import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle, Circle } from "lucide-react";
import { Lot } from "../types/Lot";
import { Art } from "../types/Art";
import { ArticleOffre } from "../types/ArticleOffre";
import { consultationType } from "../types/consultationType";
import { LotOffre } from "../types/LotOffre";
import LotDetailModal from "./LotDetailModal";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ItemSelectorProps {
  selectedConsultation: consultationType | null;
  selectedLots: LotOffre[];
  selectedArticles: ArticleOffre[];
  setSelectedLots: React.Dispatch<React.SetStateAction<LotOffre[]>>;
  setSelectedArticles: React.Dispatch<React.SetStateAction<ArticleOffre[]>>;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  selectedConsultation,
  selectedLots,
  selectedArticles,
  setSelectedLots,
  setSelectedArticles,
}) => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<(Lot | Art)[]>([]);
  const [isDetailOpen, setIsDetaiOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const isEquipement = selectedConsultation?.type === "equipement";

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedConsultation) return;

      const endpoint = isEquipement
        ? "/api/LotsOffre"
        : "/api/articlesForConsultation";

      const url = `${baseUrl}${endpoint}?consultationId=${
        selectedConsultation.id_consultation
      }&search=${encodeURIComponent(search)}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        setItems(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedConsultation]);

  const handleMontantChangeArticle = (
    id_article: string,
    id_da: string,
    newMontant: number
  ) => {
    setSelectedArticles((prev) =>
      prev.map((a) =>
        a.id_article === id_article && a.id_da === id_da
          ? { ...a, montant: newMontant }
          : a
      )
    );
  };
  const handleMontantChangeLot = (id_lot: string, newMontant: number) => {
    setSelectedLots((prev) =>
      prev.map((l) => (l.id_lot === id_lot ? { ...l, montant: newMontant } : l))
    );
  };

  const handleToggleLot = (lot: Lot) => {
    setSelectedLots((prev) => {
      const alreadySelected = prev.some((l) => l.id_lot === lot.id_lot);

      return alreadySelected
        ? prev.filter((l) => l.id_lot !== lot.id_lot)
        : [...prev, { ...lot, montant: 0 }];
    });
  };

  const handleToggleArticle = (article: Art) => {
    setSelectedArticles((prev) => {
      const alreadySelected = prev.some(
        (a) => a.id_article === article.id_article && a.id_da === article.id_da
      );

      return alreadySelected
        ? prev.filter(
            (a) =>
              !(
                a.id_article === article.id_article && a.id_da === article.id_da
              )
          )
        : [
            ...prev,
            {
              ...article,
              montant: 0,
            },
          ];
    });
  };

  const isSelected = (item: Lot | Art) =>
    isEquipement
      ? selectedLots.some((lot) => lot.id_lot === (item as Lot).id_lot)
      : selectedArticles.some(
          (art) =>
            art.id_article === (item as Art).id_article &&
            art.id_da === (item as Art).id_da
        );

  return (
    <>
      <h2 className="text-xl font-bold  pb-2 text-blue-900 text-left border-b border-gray-200">
        {isEquipement ? "Liste des Lots" : "Liste des Articles"}
      </h2>

      {/* Search input */}
      <div className="flex items-center bg-white px-4 py-1 rounded-full w-full max-w-xl flex-1 mr-4 my-2 border border-gray-300">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="bg-transparent outline-none w-full text-sm text-gray-700"
        />
      </div>

      <div className="max-h-60 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => {
            const selected = isSelected(item);
            return (
              <div
                key={
                  isEquipement
                    ? (item as Lot).id_lot
                    : `${(item as Art).id_article}-${item.id_da}`
                }
                className={`p-2 border-b border-gray-100 flex items-start justify-between hover:bg-gray-50 cursor-pointer ${
                  selected ? "bg-blue-50" : ""
                }`}
              >
                <div>
                  {isEquipement ? (
                    <div
                      className="m-1"
                      onClick={() => {
                        setIsDetaiOpen(true);
                        setDetailId((item as Lot).id_lot);
                      }}  
                    >
                      <p className="text-sm font-semibold text-gray-800  w-60">
                        Lot: {(item as Lot).id_lot}
                      </p>
                      <p className="text-xs text-gray-500  w-60">
                        Consultation: {(item as Lot).id_consultation}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-800 w-60">
                        {(item as Art).designation}
                      </p>
                      <p className="text-xs text-gray-500  w-60">
                        Quantité: {(item as Art).quantite}
                      </p>
                    </>
                  )}
                </div>
                {selected && (
                  <div>
                    <label className="block text-xs">Montant :</label>
                    <input
                      type="number"
                      value={
                        isEquipement
                          ? String(
                              selectedLots.find(
                                (l) => l.id_lot === (item as LotOffre).id_lot
                              )?.montant ?? ""
                            )
                          : String(
                              selectedArticles.find(
                                (a) =>
                                  a.id_article ===
                                    (item as ArticleOffre).id_article &&
                                  a.id_da === (item as ArticleOffre).id_da
                              )?.montant ?? ""
                            )
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const newMontant = parseFloat(val);

                        if (val === "" || isNaN(newMontant)) return;

                        if (isEquipement) {
                          handleMontantChangeLot(
                            (item as LotOffre).id_lot,
                            newMontant
                          );
                        } else {
                          handleMontantChangeArticle(
                            (item as ArticleOffre).id_article,
                            (item as ArticleOffre).id_da,
                            newMontant
                          );
                        }
                      }}
                      className="text-sm w-30 h-5 px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 border-gray-300"
                    />
                  </div>
                )}

                {selected ? (
                  <CheckCircle
                    onClick={() => {
                      if (isEquipement) {
                        handleToggleLot(item as Lot);
                      } else {
                        handleToggleArticle(item as Art);
                      }
                    }}
                    className="text-blue-700 w-5 h-5 mt-1"
                  />
                ) : (
                  <Circle
                    onClick={() => {
                      if (isEquipement) {
                        handleToggleLot(item as Lot);
                      } else {
                        handleToggleArticle(item as Art);
                      }
                    }}
                    className="text-gray-300 w-5 h-5 mt-1"
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-center text-gray-500">Aucun résultat</p>
        )}
      </div>
      {isDetailOpen && (
        <LotDetailModal
          lotId={detailId}
          open={isDetailOpen}
          onClose={() => setIsDetaiOpen(false)}
        />
      )}
    </>
  );
};

export default ItemSelector;
