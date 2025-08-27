import { useEffect, useState } from "react";

type Article = {
  id_article: number;
  id_da: string;
  designation: string;
  quantite: number;
  prix_unitaire?: number;
};

type LotDetailModalProps = {
  lotId: number | null;
  open: boolean;
  onClose: () => void;
};

export default function LotDetailModal({
  lotId,
  open,
  onClose,
}: LotDetailModalProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lotId || !open) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/lots/${lotId}`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Error fetching lot details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [lotId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4 text-blue-900">
          <h2 className="text-xl font-semibold">Détails du Lot {lotId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center py-4">Chargement...</p>
        ) : articles.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            Aucun article trouvé.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto border rounded border-gray-300">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 border">ID Article</th>
                  <th className="px-4 py-2 border">ID DA</th>
                  <th className="px-4 py-2 border">Désignation</th>
                  <th className="px-4 py-2 border">Quantité</th>
                  <th className="px-4 py-2 border">Prix Unitaire</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id_article} className="border-b">
                    <td className="px-4 py-2 border">{a.id_article}</td>
                    <td className="px-4 py-2 border">{a.id_da}</td>
                    <td className="px-4 py-2 border">{a.designation}</td>
                    <td className="px-4 py-2 border">{a.quantite}</td>
                    <td className="px-4 py-2 border">
                      {a.prix_unitaire ?? "—"} dt
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white hover:text-white hover:bg-blue-900 text-blue-900 border-blue-900 border"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
