import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import AjouterDaConsModal from "./AjouterDaConsModal";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";
import { consultationType } from "../types/consultationType";

type AddedDa = {
  da: DA;
  lotNumber: string;
};

interface ModifyConsultationProps {
  onClose: () => void;
  initialData: consultationType | null;
  relatedDA: DA[];
  relatedLots: Lot[];
}

const ModifyConsultation: React.FC<ModifyConsultationProps> = ({
  onClose,
  initialData,
  relatedDA,
  relatedLots,
}) => {
  const [form, setForm] = useState(() => ({
    id_consultation: initialData?.id_consultation ?? "",
    date_creation: initialData?.date_creation ?? "",
    nombre_des_lots: initialData?.nombre_des_lots ?? "",
  }));
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);
  const [linkedDAs, setLinkedDAs] = useState<DA[]>([]);
  const [removedDAs, setRemovedDAs] = useState<DA[]>([]);
  const [addedDas, setAddedDas] = useState<AddedDa[]>([]);

  const allLinkedDAs = [...linkedDAs, ...addedDas.map((entry) => entry.da)];

  const displayedLots = [
    ...relatedLots.filter(
      (lot) => !removedDAs.some((da) => String(da.id_da) === lot.id_da)
    ),
    ...addedDas.map(({ da, lotNumber }) => ({
      id_lot: `${form.id_consultation}${lotNumber}`,
      id_da: da.id_da,
      id_consultation: form.id_consultation,
    })),
  ];

  useEffect(() => {
    setLinkedDAs(relatedDA);
  }, [relatedDA]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteDA = (idToDelete: number) => {
    const existing = linkedDAs.find((da) => da.id_da === idToDelete);
    if (existing) {
      setRemovedDAs((prev) => [...prev, existing]);
      setLinkedDAs((prev) => prev.filter((da) => da.id_da !== idToDelete));
    } else {
      setAddedDas((prev) =>
        prev.filter((entry) => entry.da.id_da !== idToDelete)
      );
    }
  };

  const handleConfirm = async () => {
    try {
      await fetch("http://localhost:3001/api/consultation/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_consultation: form.id_consultation,
          nombre_des_lots: form.nombre_des_lots,
        }),
      });

      for (const da of removedDAs) {
        await fetch("http://localhost:3001/api/consultation/remove-da", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_da: da.id_da,
            id_consultation: form.id_consultation,
          }),
        });
      }

      for (const { da, lotNumber } of addedDas) {
        await fetch("http://localhost:3001/api/lots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_lot: `${form.id_consultation}${lotNumber}`,
            id_da: da.id_da,
            id_consultation: form.id_consultation,
          }),
        });
      }

      onClose();
    } catch (err) {
      console.error("❌ Confirmation failed:", err);
      alert("Erreur lors de la confirmation.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fermer la modification"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4 pb-4 border-b border-gray-200">
          Modifier une Consultation
        </h2>

        <div className="space-y-2">
          <label className="block text-md text-gray-700">ID</label>
          <input
            name="id_consultation"
            value={form.id_consultation}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 border rounded-md"
          />

          <label className="block text-md text-gray-700">
            Date de création
          </label>
          <input
            name="date_creation"
            value={form.date_creation}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 border rounded-md"
          />

          <label className="block text-md text-gray-700">Nombre des Lots</label>
          <input
            name="nombre_des_lots"
            value={form.nombre_des_lots}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <h3 className="text-lg font-bold text-blue-800 border-b mt-6 pb-2">
          Demandes d’Achat liées
        </h3>

        <div className="max-h-48 overflow-y-auto pr-2 mt-2 space-y-4">
          {allLinkedDAs.map((da) => (
            <div
              key={da.id_da}
              className="border-b border-neutral-300 pb-4 flex justify-between"
            >
              <div className="text-sm space-y-1">
                <div>
                  <strong>ID DA:</strong> {da.id_da}
                </div>
                <div>
                  <strong>Titre:</strong> {da.titre}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(da.date).toLocaleDateString("fr-FR")}
                </div>
                <div>
                  <strong>Montant estimé:</strong> {da.montant} TND
                </div>
                <div>
                  <strong>Statut:</strong> {da.etat}
                </div>
              </div>
              <button
                onClick={() => handleDeleteDA(da.id_da)}
                className="px-3 py-1 text-red-600 border border-red-700 rounded hover:bg-red-700 hover:text-white"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-blue-800 border-b mt-6 pb-2">
          Lots associés
        </h3>
        {displayedLots.length > 0 && (
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            {displayedLots.map((lot, index) => (
              <li key={index}>
                <strong>ID Lot:</strong> {lot.id_lot} — <strong>ID DA:</strong>{" "}
                {lot.id_da}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setIsAjouterOpen(true)}
            className="px-4 py-2 border-2 border-blue-900 text-blue-900 rounded hover:bg-blue-900 hover:text-white"
          >
            Ajouter un Lot
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
          >
            Confirmer
          </button>
        </div>
      </div>

      {isAjouterOpen && (
        <AjouterDaConsModal
          setIsModalOpen={setIsAjouterOpen}
          id_consultation={form.id_consultation}
          onDaAdded={(da, lotNumber) => {
            const alreadyExists =
              linkedDAs.some((d) => d.id_da === da.id_da) ||
              addedDas.some((entry) => entry.da.id_da === da.id_da);

            if (alreadyExists) {
              alert("Cette DA est déjà liée.");
              return;
            }

            setAddedDas((prev) => [...prev, { da, lotNumber }]);
          }}
        />
      )}
    </div>
  );
};

export default ModifyConsultation;
