import React, { useState, useEffect } from "react";
import { consultationType } from "../types/consultationType";
import { Eye, Pencil, Trash2 } from "lucide-react";
import ConsultationDetails from "./ConsultationDetails";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";
import ConfirmModal from "./ConfirmModal";

const TableConsultation = () => {
  const [consultation, setConsultation] = useState<consultationType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [relatedDA, setRelatedDA] = useState<DA[] | []>([]);
  const [lots, setLots] = useState<Lot[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // Fetch consultations on mount
  useEffect(() => {
    fetch("http://localhost:3001/api/consultations")
      .then((res) => res.json())
      .then((data) => setConsultation(data))
      .catch((err) => console.error(err));
  }, []);
  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId("");
  };
  const handleConfirmDelete = () => {
    handleDeleteConsultation(deleteId);
    setConfirmOpen(false);
    setDeleteId("");
  };
  const handleDeleteConsultation = async (id_consultation: string) => {

    try {
      const res = await fetch(
        `http://localhost:3001/api/consultation/${id_consultation}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setConsultation((prev) =>
          prev.filter((c) => c.id_consultation !== id_consultation)
        );
      } else {
        console.error("Échec de suppression");
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };
  // Handle "Voir" click
  const openDetails = async (consult: consultationType) => {
    setSelectedConsultation(consult);
    setModalOpen(true);

    try {
      const res = await fetch(
        `http://localhost:3001/api/consultation-details/${consult.id_consultation}`
      );
      const data = await res.json();
      console.log("Related Da :", data.demandes);
      setRelatedDA(data.demandes);
      setLots(data.lots);
    } catch (error) {
      console.error("Erreur lors du chargement des détails :", error);
    }
  };

  return (
    <>
      <table className="w-full text-center border-separate border-spacing-0 ">
        <thead>
          <tr>
            <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-l-xl">
              ID
            </th>
            <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm">
              Date De Création
            </th>
            <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm">
              Nombre de Lots
            </th>
            <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-r-xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {consultation.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="text-center py-3 px-4 text-sm text-gray-700 rounded-l-xl">
                {row.id_consultation}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {new Date(row.date_creation).toLocaleDateString("fr-FR")}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {row.nombre_des_lots}
              </td>
              <td className="flex justify-between items-center py-3 px-4">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir"
                  onClick={() => openDetails(row)}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={()=>openConfirm(row.id_consultation)}
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmOpen && <ConfirmModal isOpen={confirmOpen} message={<><p className="text-xl mb-4 border-b-1 pb-4 border-b-gray-300">Êtes-vous sûr de supprimer cette Consultation ?</p> <p className="text-sm text-gray-500">Notez que les lots liées a cette consultation vont etre supprimées</p></>} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete}/>}
      <ConsultationDetails
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        consultation={selectedConsultation}
        relatedDemandes={relatedDA}
        relatedLots={lots}
      />
    </>
  );
};

export default TableConsultation;
