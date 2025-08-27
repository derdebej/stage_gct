import React, { useState, useEffect } from "react";
import { X, CircleCheckBig } from "lucide-react";
import { DA } from "../types/DA";
import { Art } from "../types/Art";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ConsultationProps {
  totalPrice: number;
  totalLots: number;
  isOpen: boolean;
  onClose: () => void;
  selectedRows: DA[];
  setSelectedRows: any;
  onRefresh: any;
}

const Consultation = ({
  totalPrice,
  isOpen,
  onClose,
  selectedRows,
  setSelectedRows,
  onRefresh,
}: ConsultationProps) => {
  if (!isOpen) return null;
  const [articles, setArticles] = useState<Art[]>([]);
  const [consultationId, setConsultationId] = useState("");
  const [nombreLots, setNombreLots] = useState("");
  const [error, setError] = useState("");
  const [articleLots, setArticleLots] = useState<{
    [articleId: string]: number | "";
  }>({});

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [type, setType] = useState("");
  const [articlePage, setArticlePage] = useState(1);
  const [totalArticlePages, setTotalArticlePages] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userid = user?.id_utilisateur;

  useEffect(() => {
    if (articles.length > 0) {
      setArticleLots((prev) => {
        const updated = { ...prev };
        articles.forEach((art) => {
          const key = `${art.id_article}-${art.id_da}`;
          if (!(key in updated)) {
            updated[key] = "";
          }
        });
        return updated;
      });
    }
  }, [articles]);

  

  useEffect(() => {
    const fetchArticlesForConsommable = async () => {
      const id_das = selectedRows.map((row) => row.id_da).join(",");

      try {
        const res = await fetch(
          `${baseUrl}/api/article-consultation?id_das=${id_das}&page=${articlePage}`
        );
        const result = await res.json();

        const articles = result?.data || [];

        setTotalMontantEstime(result.totalMontantEstime || 0);
        setArticles(articles);
        setTotalArticlePages(result.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch articles", err);
        setMessage("Erreur lors de la récupération des articles");
        setMessageType("error");
        setTimeout(() => setMessage(""), 2000);
      }
    };

    fetchArticlesForConsommable();
  }, [type, articlePage, selectedRows]);

  useEffect(() => {
    if (!isOpen || selectedRows.length === 0) return;

    const natures = selectedRows.map((row) => row.nature);
    const allSame = natures.every((n) => n === natures[0]);

    if (!allSame) {
      setError("Toutes les demandes doivent avoir la même nature");
      setMessage("Toutes les demandes doivent avoir la même nature");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } else {
      const commonNature = natures[0];
      setError("");
      setType(commonNature === "Investissement" ? "equipement" : "consommable");
    }
  }, [isOpen, selectedRows]);

  const handleCreateConsultation = async () => {
    if (type === "equipement") {
      if (!consultationId || !nombreLots) {
        setError("Tous les champs sont requis.");
        return;
      }
    } else {
      if (!consultationId) {
        setError("Tous les champs sont requis.");
        return;
      }
    }

    try {
      const payload = {
        id_consultation: consultationId,
        nombre_lots: Number(nombreLots),
        date_creation: new Date().toISOString(),
        userid,
        type,
        articleLots,
        id_das: selectedRows.map((row) => row.id_da),
      };
      console.log(payload)
      const res = await fetch(`${baseUrl}/api/enrigistrer-consultation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      setMessage("Consultation regroupée avec succès");
      setMessageType("success");
      setSelectedRows([]);
      setArticleLots({});
      setConsultationId("");
      setNombreLots("");
      setError("");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
        onRefresh();
        onClose();
      }, 2000);
    } catch (err) {
      setMessage("Échec de la création de la consultation");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const [totalMontantEstime, setTotalMontantEstime] = useState(0);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      {message && (
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          {messageType === "success" ? (
            <CircleCheckBig className="text-green-600" size={28} />
          ) : (
            <X className="text-red-600" size={28} />
          )}
          {message}
        </div>
      )}

      {!message && (
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Créer une Consultation
          </h2>

          <div className="grid gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                ID Consultation
              </label>
              <input
                value={consultationId}
                onChange={(e) => setConsultationId(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: CST2025"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Type :</label>
              <div className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100">
                {type}
              </div>
            </div>

            {type == "equipement" && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Nombre de Lots
                </label>
                <input
                  value={nombreLots}
                  onChange={(e) => setNombreLots(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-900 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 3"
                />
              </div>
            )}
          </div>
          {type === "equipement" ? (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">ID DA</th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Designation
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      quantité
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">PU</th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      N° Lot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => {
                    const key = `${article.id_article}-${article.id_da}`;

                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="px-4 py-2">{article.id_da}</td>
                        <td className="px-4 py-2">{article.designation}</td>
                        <td className="px-4 py-2">{article.quantite}</td>
                        <td className="px-4 py-2">
                          {article.prix_unitaire || "—"} dt
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={articleLots[key] || ""}
                            onChange={(e) =>
                              setArticleLots((prev) => ({
                                ...prev,
                                [key]: e.target.value
                                  ? Number(e.target.value)
                                  : "",
                              }))
                            }
                            className="w-25 px-3 py-1.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-900"
                          >
                            <option value="">Choisir</option>
                            {Array.from(
                              { length: Number(nombreLots) || 0 },
                              (_, i) => i + 1
                            ).map((lotNum) => (
                              <option key={lotNum} value={lotNum}>
                                Lot {lotNum}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="px-4 py-2 font-semibold text-gray-700">
                      Montant Total
                    </td>
                    <td className="px-4 py-2">{totalPrice} dt</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  disabled={articlePage === 1}
                  onClick={() => setArticlePage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-1 rounded-md border ${
                    articlePage === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-900 border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  Précédent
                </button>

                <span className="text-gray-600 font-medium mt-1">
                  Page {articlePage} / {totalArticlePages}
                </span>

                <button
                  disabled={articlePage === totalArticlePages}
                  onClick={() =>
                    setArticlePage((p) => Math.min(totalArticlePages, p + 1))
                  }
                  className={`px-3 py-1 rounded-md border ${
                    articlePage === totalArticlePages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-900 border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  Suivant
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">DA</th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Designation
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Quantite
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Prix Unitaire
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-4 py-2">{article.id_da}</td>
                      <td className="px-4 py-2">{article.designation}</td>
                      <td className="px-4 py-2">{article.quantite}</td>
                      <td className="px-4 py-2">
                        {article.prix_unitaire || "—"} dt
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-right font-semibold text-gray-700"
                    >
                      Montant total estimé
                    </td>
                    <td className="px-4 py-2 font-bold text-blue-900 whitespace-nowrap">
                      {totalMontantEstime.toFixed(3)} dt
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  disabled={articlePage === 1}
                  onClick={() => setArticlePage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-1 rounded-md border ${
                    articlePage === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-900 border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  Précédent
                </button>

                <span className="text-gray-600 font-medium mt-1">
                  Page {articlePage} / {totalArticlePages}
                </span>

                <button
                  disabled={articlePage === totalArticlePages}
                  onClick={() =>
                    setArticlePage((p) => Math.min(totalArticlePages, p + 1))
                  }
                  className={`px-3 py-1 rounded-md border ${
                    articlePage === totalArticlePages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-blue-900 border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition"
            >
              Fermer
            </button>
            <button
              onClick={handleCreateConsultation}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
            >
              Regrouper en une Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
