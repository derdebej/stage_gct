import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { X } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface OffreDetailProps {
  id_offre: string;
  onClose: () => void;
}

const OffreDetail: React.FC<OffreDetailProps> = ({ id_offre, onClose }) => {
  const [offre, setOffre] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/offres/${id_offre}/detail`);
        if (!res.ok) throw new Error("Erreur lors du chargement de l'offre");
        const data = await res.json();
        console.log("Offre data:", data);
        setOffre(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffre();
  }, [id_offre]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!offre) return null;

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
          Détails de l'offre
        </h2>
        <p className="mb-2">
          <strong className="text-blue-900">ID Offre:</strong> {offre.id_offre}
        </p>
        <p className="mb-2">
          <strong className="text-blue-900">Date:</strong> {new Date(offre.date).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong className="text-blue-900">Fournisseur:</strong> {offre.id_fournisseur}
        </p>
        <p className="mb-2">
          <strong className="text-blue-900">Chemin Document:</strong> {offre.chemin_document}
        </p>
        <p className="mb-2">
          <strong className="text-blue-900">Consultation:</strong> {offre.id_consultation}
        </p>


        <h3 className="text-xl font-semibold text-blue-900  my-4">
          {offre.consultation_type === "consommable"
            ? "Articles proposés"
            : "Lots proposés"}
        </h3>

        <table className="w-full border-collapse border text-gray-800">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Montant</th>
            </tr>
          </thead>
          <tbody>
            {offre.consultation_type === "consommable"
              ? offre.articles.map((a: any) => (
                  <tr key={a.id_article}>
                    <td className="border p-2">{a.id_article}</td>
                    <td className="border p-2">{a.designation}</td>
                    <td className="border p-2">{a.montant}</td>
                  </tr>
                ))
              : offre.lots.map((l: any) => (
                  <tr key={l.id_lot}>
                    <td className="border p-2">{l.id_lot}</td>
                    <td className="border p-2">{l.nom_lot}</td>
                    <td className="border p-2">{l.montant}</td>
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

export default OffreDetail;
