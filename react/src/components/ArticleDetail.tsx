import React from "react";
import { Art } from "../types/Art";
import { X } from "lucide-react";
type Props = {
  article: Art;
  onClose;
};
const ArticleDetail = ({ article, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b-1 border-gray-200">
          Détails de l'article
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <strong>ID article :</strong> {article.id_article}
          </div>
          <div>
            <strong>Designation :</strong> {article.designation}
          </div>
          <div>
            <strong>Description :</strong> {article.description}
          </div>
          <div>
            <strong>Quantité :</strong> {article.quantite}
          </div>
          <div>
            <strong>Prix unitatire :</strong> {article.prix_unitaire} dt
          </div>
          <div>
            <strong>Prix total :</strong> {article.prix_unitaire*article.quantite} dt
          </div>
          <div>
            <strong>Demande d'achat liée :</strong> {article.id_da}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
