import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { X } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface CommandeDetailProps {
  id_commande: number;
  onClose: () => void;
}

const CommandeDetail: React.FC<CommandeDetailProps> = ({
  id_commande,
  onClose,
}) => {
  const [commande, setCommande] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${baseUrl}/api/commandes/${id_commande}/details`
        );
        if (!res.ok)
          throw new Error("Erreur lors du chargement de la commande");
        const data = await res.json();
        console.log("Commande data:", data.articles);
        setCommande(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id_commande]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!commande) return null;

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
          Détails de la commande
        </h2>
        <p>
          <strong className="text-blue-900">ID Commande:</strong> {commande.id_commande}
        </p>
        <p>
          <strong className="text-blue-900">Date:</strong>{" "}
          {new Date(commande.date_commande).toLocaleDateString()}
        </p>
        <p>
          <strong className="text-blue-900">Consultation:</strong> {commande.id_consultation}
        </p>
        <p>
          <strong className="text-blue-900">Fournisseur:</strong> {commande.id_fournisseur}
        </p>

        {/* Articles or Lots */}

        <h3 className="text-xl font-semibold text-blue-900  my-4">
          {commande.consultation_type === "consommable"
            ? "Articles commandés"
            : "Lots commandés"}
        </h3>

        <table className="w-full border-collapse border text-gray-800">
          <thead>
            <tr className="bg-blue-100">
              {commande.consultation_type === "consommable" ? (
                <>
                  <th className="border p-2">ID Article</th>
                  <th className="border p-2">ID DA</th>
                  <th className="border p-2">Nom Article</th>
                  <th className="border p-2">Quantité</th>
                </>
              ) : (
                <>
                  <th className="border p-2">ID Lot</th>
                  <th className="border p-2">ID DA</th>
                  <th className="border p-2">ID Consultation</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {commande.consultation_type === "consommable"
              ? commande.articles.map((a: any) => (
                  <tr key={`${a.id_article}-${a.id_da}`}>
                    <td className="border p-2">{a.id_article}</td>
                    <td className="border p-2">{a.id_da}</td>
                    <td className="border p-2">{a.designation}</td>
                    <td className="border p-2">{a.quantite}</td>
                  </tr>
                ))
              : commande.lots.map((l: any) => (
                  <tr key={l.id_lot}>
                    <td className="border p-2">{l.id_lot}</td>
                    <td className="border p-2">{l.id_da}</td>
                    <td className="border p-2">{l.id_consultation}</td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
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

export default CommandeDetail;
