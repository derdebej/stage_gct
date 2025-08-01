import React, { useState, useEffect } from "react";
import { consultationType } from "../types/consultationType";
import { Eye, Pencil, Trash2, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import ConsultationDetails from "./ConsultationDetails";
import { DA } from "../types/DA";
import { Lot } from "../types/Lot";
import ConfirmModal from "./ConfirmModal";
import ModifyConsultation from "./ModifyConsModal";
const baseUrl = import.meta.env.VITE_API_BASE_URL;


type Props = {
  openConsultation?: consultationType | null;
};

const TableConsultation: React.FC<Props> = ({ openConsultation }) => {
  const [consultation, setConsultation] = useState<consultationType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<consultationType | null>(null);
  const [relatedDA, setRelatedDA] = useState<DA[] | []>([]);
  const [lots, setLots] = useState<Lot[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    fetch(`${baseUrl}/api/consultations?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setConsultation(data.data);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page]);
  useEffect(() => {
    if (openConsultation) {
      openDetails(openConsultation);
    }
  }, [openConsultation]);

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
        `${baseUrl}/api/consultation/${id_consultation}`,
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

  const openModify = async (consult: consultationType) => {
    setSelectedConsultation(consult);
    setIsModifyOpen(true);

    try {
      const res = await fetch(
        `${baseUrl}/api/consultation-details/${consult.id_consultation}`
      );
      const data = await res.json();
      setRelatedDA(data.demandes);
      setLots(data.lots);
    } catch (error) {
      console.error("Erreur lors du chargement des détails :", error);
    }
  };
  // Handle "Voir" click
  const openDetails = async (consult: consultationType) => {
    setSelectedConsultation(consult);
    setModalOpen(true);

    try {
      const res = await fetch(
        `${baseUrl}/api/consultation-details/${consult.id_consultation}`
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
                  onClick={() => openModify(row)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => openConfirm(row.id_consultation)}
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
      {confirmOpen && (
        <ConfirmModal
          isOpen={confirmOpen}
          message={
            <>
              <p className="text-xl mb-4 border-b-1 pb-4 border-b-gray-300">
                Êtes-vous sûr de supprimer cette Consultation ?
              </p>{" "}
              <p className="text-sm text-gray-500">
                Notez que les lots liées a cette consultation vont etre
                supprimées
              </p>
            </>
          }
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <div className="flex items-center gap-4 bg-gray-200 rounded-xl py-2 px-4 w-max mt-4 text-gray-800">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer flex hover:bg-gray-100 bg-white py-1 px-2 rounded-lg"
        >
          <ArrowBigLeft /> Precedent
        </button>
        <span className="bg-white py-1 px-2 rounded-lg">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="cursor-pointer flex hover:bg-gray-100 bg-white py-1 px-2 rounded-lg"
        >
          Suivant <ArrowBigRight />
        </button>
      </div>
      <ConsultationDetails
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        consultation={selectedConsultation}
        relatedDemandes={relatedDA}
        relatedLots={lots}
      />
      {isModifyOpen && (
        <ModifyConsultation
          onClose={() => setIsModifyOpen(false)}
          initialData={selectedConsultation}
          relatedDA={relatedDA}
          relatedLots={lots}
        />
      )}
    </>
  );
};

export default TableConsultation;
