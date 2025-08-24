import React, { useState, useEffect } from "react";
import { X, PlusCircle, Shredder, CheckCheck, CircleCheckBig } from "lucide-react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;



interface AjouterDocumentProps {
  onRefresh: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface Article {
  position: string;
  code: string;
  designation: string;
  quantity: string;
  unit_price: string;
  detail: string;
}

const AjouterDocument = ({
  isOpen,
  onClose,
  onRefresh,
}: AjouterDocumentProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userid = user?.id_utilisateur;

  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [data, setData] = useState({
    numero: null,
    demandeur: null,
    titre: null,
    date: null,
    coutTotale: null,
    type: "",
    objet: "",
    numAED: "",
    codeInvest: "",
    articles: [] as Article[],
  });

  const resetStates = () => {
    setFileName("");
    setIsDataLoaded(false);
    setErrorMsg("");
    setData({
      numero: null,
      demandeur: null,
      titre: null,
      date: null,
      coutTotale: null,
      type: "",
      objet: "",
      numAED: "",
      codeInvest: "",
      articles: [],
    });
    onRefresh();
  };

  useEffect(() => {
    return () => resetStates();
  }, []);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${baseUrl}/enregistrer-demande`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userid,
          fileName,
        }),
      });

      const result = await res.json();
      setMessage("Document enregistré avec succès.");
      setMessageType("success");
      resetStates();
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      setMessage("Erreur lors de l'enregistrement.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 3000);
    }
  };
  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsDataLoaded(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur d’upload inconnue.");
      }

      const result = await res.json();

      setData({
        numero: result.numero,
        demandeur: result.demandeur,
        titre: result.titre,
        date: result.date,
        coutTotale: result.coutTotale,
        type: result.type,
        objet: result.objet,
        numAED: result.numeroAED.replace(/ /g, ""),
        codeInvest: result.codeInvest,
        articles: Array.isArray(result.articles) ? result.articles : [],
      });
    } catch (err: any) {
      console.error("Erreur upload:", err);
      setErrorMsg(err.message || "Erreur inattendue.");
    }
  };
  if (message) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl px-6 py-8 shadow-md flex items-center gap-3 text-lg text-gray-800 font-semibold animate-fade-in">
          {messageType === "success" ? (
            <CircleCheckBig className="text-green-600" size={28} />
          ) : (
            <X className="text-red-600" size={28} />
          )}
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
            resetStates();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center border-b pb-4">
          Ajouter un document
        </h2>

        {!isDataLoaded ? (
          <>
            <p className="text-gray-600 mb-4">
              Sélectionnez un fichier PDF pour l’extraction.
            </p>
            <label className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <PlusCircle /> Ajouter un document
            </label>
          </>
        ) : (
          <>
            {errorMsg && (
              <div className="text-red-600 font-medium mt-4">⚠️ {errorMsg}</div>
            )}

            <div className="space-y-2 mt-4 text-sm text-gray-800">
              {data.numero && (
                <DisplayItem label="Numéro" value={data.numero} />
              )}
              {data.demandeur && (
                <DisplayItem label="Demandeur" value={data.demandeur} />
              )}
              {data.titre && <DisplayItem label="Titre" value={data.titre} />}
              {data.date && <DisplayItem label="Date" value={data.date} />}
              {fileName && (
                <DisplayItem
                  label="Chemin"
                  value={`/Demande d'achat/${fileName}`}
                />
              )}
              {data.type && <DisplayItem label="Nature" value={data.type} />}
              {data.objet && <DisplayItem label="Objet" value={data.objet} />}
              {data.numAED && (
                <DisplayItem label="N° AED" value={data.numAED.replace(/ /g, "")} />
              )}
              {data.coutTotale && (
                <DisplayItem
                  label="Montant total"
                  value={`${data.coutTotale} DT`}
                />
              )}
            </div>

            {data.articles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Articles :
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {data.articles.map((a, idx) => (
                    <li key={idx}>
                      {a.position} - {a.code} - {a.designation} - {a.quantity} -{" "}
                      {a.unit_price} - {a.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={resetStates}
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Shredder />
                Supprimer
              </button>
              {!errorMsg && (
                <button
                  onClick={handleConfirm}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <CheckCheck />
                  Confirmer
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DisplayItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="text-blue-900 font-semibold">
    {label} : <span className="text-gray-700">{value}</span>
  </div>
);

export default AjouterDocument;
