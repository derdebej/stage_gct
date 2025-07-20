import React from "react";
import { Divide, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Shredder, PlusCircle, CheckCheck } from "lucide-react";
import { error } from "console";

interface AjouterDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AjouterDocument = ({ isOpen, onClose }: AjouterDocumentProps) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [numero, setNumero] = useState(null);
  const [demandeur, setDemandeur] = useState(null);
  const [titre, setTitre] = useState(null);
  const [date, setDate] = useState(null);
  const [fileName, setFileName] = useState("");
  const [coutTotale, setCoutTotale] = useState(null);
  const [errorMsg, setErrorMsg] = useState("")
  const [type, setType] = useState("")
  const [codeInvest,setCodeInvest] = useState("")
  const [numAED , setNumAED] = useState("")
  const [objet,setObjet] = useState("")

  interface Article {
    position: string;
    code: string;
    designation: string;
    quantity: string;
    unit_price: string;
    detail: string;
  }

  const [articles, setArticles] = useState<Article[]>([]);

  const resetStates = () => {
    setIsDataLoaded(false);
    setFileName("");
    setNumero(null);
    setDemandeur(null);
    setTitre(null);
    setDate(null);
    setArticles([]);
    setCoutTotale(null);
    setErrorMsg("")
    setType("")
    setObjet("")
    setNumAED("")
    setCodeInvest("")

  };
  useEffect(() => {
    return () => {
      resetStates();
    };
  }, []);

  if (!isOpen) return null;
  const handleConfirm = async () => {
    try {
      const res = await fetch("http://localhost:3001/enregistrer-demande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero,
          demandeur,
          titre,
          date,
          fileName,
          articles,
        }),
      });

      const result = await res.json();
      console.log("Données enregistrées avec succès :", result);

      resetStates();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Fichier sélectionné :", file.name);
    setIsDataLoaded(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur inconnue lors de l'upload.");
        }

      const data = await res.json();
      console.log("Réponse du backend:", data);
      setNumero(data.numero);
      setDemandeur(data.demandeur);
      setTitre(data.titre);
      setDate(data.date);
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setCoutTotale(data.coutTotale);
      setType(data.type)
      setObjet(data.objet)
      setNumAED(data.numeroAED)
      setCodeInvest(data.codeInvest)

    } catch (err) {
      console.error("Erreur upload:", err);
      setErrorMsg(err.message || "Erreur inattendue.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative  overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
            resetStates();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close ajouter document modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 pb-4 text-blue-900 text-center border-b border-gray-200">
          Ajouter un document
        </h2>
        {!isDataLoaded && (
          <>
            <p className="text-gray-600 mb-4">
              Sélectionnez un fichier pdf à ajouter à la demande d'achat.
            </p>

            <label className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <PlusCircle />
              Ajouter un document
            </label>
          </>
        )}
        {errorMsg && (
          <div className="text-red-600 font-medium mt-4">⚠️ {errorMsg}</div>
        )}
        {numero && (
          <div className="mt-4 text-blue-900 font-semibold">
            Numéro extrait : <span className="text-gray-700"> {numero}</span>
          </div>
        )}
        {demandeur && (
          <div className="mt-2 text-blue-900 font-semibold">
            Demandeur extrait :{" "}
            <span className="text-gray-700">{demandeur}</span>
          </div>
        )}
        {titre && (
          <div className="mt-2 text-blue-900 font-semibold">
            Titre extrait : <span className="text-gray-700">{titre}</span>
          </div>
        )}
        {date && (
          <div className="mt-2 text-blue-900 font-semibold">
            Date extraite : <span className="text-gray-700">{date}</span>
          </div>
        )}
        {numero && fileName && (
          <div className="mt-2 text-blue-900 font-semibold">
            Chemin de demande d'achat:
            <span className="text-gray-700"> /Demande d'achat/{fileName}</span>
          </div>
        )}
        {type && (
          <div className="mt-2 text-blue-900 font-semibold">
            Nature : <span className="text-gray-700">{type}</span>
          </div>
        )}
        {objet && (
          <div className="mt-2 text-blue-900 font-semibold">
            Objet : <span className="text-gray-700">{objet}</span>
          </div>
        )}
        {numAED && (
          <div className="mt-2 text-blue-900 font-semibold">
            N° AED : <span className="text-gray-700">{numAED}</span>
          </div>
        )}
        {codeInvest && (
          <div className="mt-2 text-blue-900 font-semibold">
            Code d'investisement : <span className="text-gray-700">{codeInvest}</span>
          </div>
        )}
        {coutTotale && (
          <div className="mt-2 text-blue-900 font-semibold">
            {" "}
            le montant totale est :{" "}
            <span className="text-gray-700">{coutTotale} dt</span>
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Articles extraits :
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {articles.map((article, index) => (
                <li key={index} className="text-gray-700">
                  {article.position} - {article.code}- {article.designation} -{" "}
                  {article.quantity} - {article.unit_price}{" "}
                  {" - " + article.detail}
                </li>
              ))}
            </ul>
          </div>
        )}
        {isDataLoaded && (
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                resetStates();
              }}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mt-4"
            >
              <Shredder />
              Supprimer le fichier
            </button>
            {!errorMsg && <button
              onClick={handleConfirm}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 text-md cursor-pointer mt-4"
            >
              <CheckCheck />
              Confirmer
            </button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AjouterDocument;
