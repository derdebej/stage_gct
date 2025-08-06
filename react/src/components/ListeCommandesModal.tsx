import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CommandeType } from "../types/Comm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type Props = {
  setIsModalOpen: (value: boolean) => void;
  onSelectCommande: (commande: CommandeType) => void;
};

const ListeCommandesModal = ({ setIsModalOpen, onSelectCommande }: Props) => {
  const [commandes, setCommandes] = useState<CommandeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/commandes`);
        const data = await res.json();
        setCommandes(data.commandes);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-3">Liste des commandes</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : commandes.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune commande trouvée.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {commandes.map((commande) => (
              <button
                key={commande.id_commande}
                onClick={() => {
                  onSelectCommande(commande);
                }}
                className="w-full text-left p-3 hover:bg-blue-50 transition rounded-md"
              >
                <p className="font-semibold text-blue-900">Commande #{commande.id_commande}</p>
                <p className="text-sm text-gray-600">Date: {commande.date}</p>
                <p className="text-sm text-gray-600">Montant: {commande.statut} TND</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeCommandesModal;
