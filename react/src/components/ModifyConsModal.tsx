import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import AjouterDaConsModal from "./AjouterDaConsModal";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";

type AddedDa = {
  da: DA;
  lotNumber: string;
};

const ModifyConsultation = ({
  onClose,
  initialData,
  relatedDA,
  relatedLots,
}) => {
  const [form, setForm] = useState(
    initialData || {
      id_consultation: "",
      date_creation: "",
      nombre_des_lots: "",
    }
  );
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);
  const [linkedDAs, setLinkedDAs] = useState<DA[]>([]);
  const [removedDAs, setRemovedDAs] = useState<DA[]>([]);
  const [addedDas, setAddedDas] = useState<AddedDa[]>([]);
  const [addedLots, setAddedLots] = useState<Lot[]>([]);
  const allLinkedDAs = [...linkedDAs, ...addedDas.map((entry) => entry.da)];
  const displayedLots = [
    ...relatedLots.filter(
      (lot) => !removedDAs.some((da) => da.id_da === lot.id_da)
    ),
    ...addedDas.map(({ da, lotNumber }) => ({
      id_lot: `${form.id_consultation}${lotNumber}`,
      id_da: da.id_da,
      id_consultation: form.id_consultation,
    })),
  ];

  useEffect(() => {
    if (relatedDA) {
      setLinkedDAs(relatedDA);
    }
  }, [relatedDA]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleDeleteDA = (idToDelete: number) => {
    // Check if it's from linkedDAs (pre-existing)
    const existing = linkedDAs.find((da) => da.id_da === idToDelete);
    if (existing) {
      setRemovedDAs((prev) => [...prev, existing]);
      setLinkedDAs((prev) => prev.filter((da) => da.id_da !== idToDelete));
      return;
    }

    // Otherwise, it's a newly added DA → remove from addedDAs
    setAddedDas((prev) =>
      prev.filter((entry) => entry.da.id_da !== idToDelete)
    );
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
        const id_lot = `${form.id_consultation}${lotNumber}`;

        await fetch("http://localhost:3001/api/lots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_lot,
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative  overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close ajouter document modal"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Modifier une Consultation
        </h2>

        <div className="space-y-2">
          <label className="block text-md text-gray-700">ID</label>
          <input
            name="id_consultation"
            value={form.id_consultation}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">
            Date de création
          </label>
          <input
            name="date_creation"
            value={form.date_creation}
            disabled
            className="w-full px-4 py-2 bg-neutral-200 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <label className="block text-md text-gray-700">Nombre des Lots</label>
          <input
            name="nombre_des_lots"
            value={form.nombre_des_lots}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <h3 className="font-bold text-lg text-blue-800 border-b pb-2 mt-6">
          Demande d'Achat liée
        </h3>
        <div className="max-h-46 overflow-y-auto pr-2 ">
          {allLinkedDAs &&
            allLinkedDAs.map((relatedDemande, index) => (
              <div
                key={index}
                className="flex justify-between pr-20 items-center mt-6 border-b border-neutral-300"
              >
                <div className="space-y-2 text-sm pb-6 ">
                  <div>
                    <strong>ID DA :</strong> {relatedDemande.id_da}
                  </div>
                  <div>
                    <strong>Titre :</strong> {relatedDemande.titre}
                  </div>
                  <div>
                    <strong>Date :</strong>{" "}
                    {new Date(relatedDemande.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <strong>Montant estimé :</strong> {relatedDemande.montant}{" "}
                    TND
                  </div>
                  <div>
                    <strong>Statut :</strong> {relatedDemande.etat}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDA(relatedDemande.id_da)}
                  className="px-4 py-2  text-red-600 border-2 border-red-700 rounded-md bg-white hover:bg-red-700 hover:text-white"
                >
                  Supprimer
                </button>
              </div>
            ))}
        </div>
        <h3 className="mt-6 font-bold text-lg text-blue-800 border-b pb-2">
          Lots associés
        </h3>
        {displayedLots.length > 0 && (
          <>
            <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
              {displayedLots.map((lot, index) => (
                <li key={index}>
                  <strong>ID Lot:</strong> {lot.id_lot} —{" "}
                  <strong>ID DA:</strong> {lot.id_da}
                </li>
              ))}
            </ul>
          </>
        )}
        <div className=" flex justify-between mt-6 text-right">
          <button
            onClick={() => setIsAjouterOpen(true)}
            className="px-4 py-2  text-blue-800 border-2 border-blue-900 rounded-md bg-white hover:bg-blue-900 hover:text-white"
          >
            Ajouter un Lot
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2  text-white rounded-md bg-blue-800 hover:bg-blue-900 "
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
            if (alreadyExists) return alert("Cette DA est déjà liée.");

            setAddedDas((prev) => [...prev, { da, lotNumber }]);
          }}
        />
      )}
    </div>
  );
};

export default ModifyConsultation;
