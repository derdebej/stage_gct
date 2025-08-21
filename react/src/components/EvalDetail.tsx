import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { X } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface EvalDetailProps {
  id_evaluation: string;
  onClose: () => void;
}

const EvalDetail: React.FC<EvalDetailProps> = ({ id_evaluation, onClose }) => {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${baseUrl}/evaluations/${id_evaluation}/detail`
        );
        if (!res.ok)
          throw new Error("Erreur lors du chargement de l'évaluation");
        const data = await res.json();
        setEvaluation(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id_evaluation]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>
        <div className="p-4 space-y-4">

          <h2 className="text-2xl font-semibold text-blue-900 text-center border-b pb-4 mb-4">
            Détails de l'évaluation
          </h2>
          <p>
            <strong className="text-blue-900">ID Évaluation:</strong> {evaluation.id_evaluation}
          </p>
          <p>
            <strong className="text-blue-900">Date:</strong>{" "}
            {new Date(evaluation.date).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-blue-900">Chemin:</strong> {evaluation.chemin_evaluation}
          </p>
          <h3 className="text-xl font-semibold text-blue-900  my-4">
            {evaluation.consultation_type === "consommable"
              ? "Articles évalués"
              : "Lots évalués"}
          </h3>

          <table className="w-full border-collapse border text-gray-800">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nom</th>
                <th className="border p-2">Conformité</th>
              </tr>
            </thead>
            <tbody>
              {evaluation.consultation_type === "consommable"
                ? evaluation.articles.map((a: any) => (
                    <tr key={a.id_article}>
                      <td className="border p-2">{a.id_article}</td>
                      <td className="border p-2">{a.designation}</td>
                      <td className="border p-2">{a.conformite}</td>
                    </tr>
                  ))
                : evaluation.lots.map((l: any) => (
                    <tr key={l.id_lot}>
                      <td className="border p-2">{l.id_lot}</td>
                      <td className="border p-2">{l.nom_lot}</td>
                      <td className="border p-2">{l.conformite}</td>
                    </tr>
                  ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvalDetail;
