import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { X } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ReceptionDetailProps {
  id_reception: number;
  onClose: () => void;
}

const ReceptionDetail: React.FC<ReceptionDetailProps> = ({
  id_reception,
  onClose,
}) => {
  const [reception, setReception] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReception = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/receptions/${id_reception}/detail`);
        if (!res.ok)
          throw new Error("Erreur lors du chargement de la réception");
        const data = await res.json();
        console.log("Reception data:", data);
        setReception(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReception();
  }, [id_reception]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!reception) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>
          <h2 className="text-2xl font-semibold text-blue-900 text-center border-b pb-4 mb-4">Détails de la réception</h2>
          <p>
            <strong className="text-blue-900">ID Réception:</strong> {reception.id_reception}
          </p>
          <p>
            <strong className="text-blue-900">Date:</strong>{" "}
            {new Date(reception.date_reception).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-blue-900">Commande:</strong> {reception.id_commande}
          </p>
          <p>
            <strong className="text-blue-900">Consultation:</strong> {reception.id_consultation}
          </p>

          <h3 className="text-xl font-semibold text-blue-900  my-4">
            {reception.consultation_type === "consommable"
              ? "Articles reçus"
              : "Lots reçus"}
          </h3>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-blue-100">
                {reception.consultation_type === "consommable" ? (
                  <>
                    <th className="border p-2">ID Article</th>
                    <th className="border p-2">ID DA</th>
                    <th className="border p-2">Nom Article</th>
                    <th className="border p-2">Quantité Reçue</th>
                  </>
                ) : (
                  <>
                    <th className="border p-2">ID Lot</th>
                    <th className="border p-2">Nom Lot</th>
                    <th className="border p-2">Reçu ?</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reception.consultation_type === "consommable"
                ? reception.articles.map((a: any) => (
                    <tr key={`${a.id_article}-${a.id_da}`}>
                      <td className="border p-2">{a.id_article}</td>
                      <td className="border p-2">{a.id_da}</td>
                      <td className="border p-2">{a.designation}</td>
                      <td className="border p-2">{a.quantite_recue}</td>
                    </tr>
                  ))
                : reception.lots.map((l: any) => (
                    <tr key={l.id_lot}>
                      <td className="border p-2">{l.id_lot}</td>
                      <td className="border p-2">{l.nom_lot}</td>
                      <td className="border p-2">
                        {l.recu ? "✅ Oui" : "❌ Non"}
                      </td>
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

export default ReceptionDetail;
