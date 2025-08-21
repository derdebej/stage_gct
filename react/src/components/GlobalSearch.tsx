import React, { useState, useRef, useEffect } from "react";
import Loading from "../components/Loading";
import ArticlesDetail from "./ArticleDetail";
import ConsultationDetail from "./ConsultationDetails";
import OffreDetail from "./OffreDetail";
import EvalDetail from "./EvalDetail";
import CommandeDetail from "./commandeDetail";
import ReceptionDetail from "./receptionDetail";
import { Search } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [articlesDetails, setArticlesDetails] = useState(false);
  const [lotsDetails, setLotsDetails] = useState(false);
  const [consultationsDetails, setConsultationsDetails] = useState(false);
  const [offresDetails, setOffresDetails] = useState(false);
  const [evaluationsDetails, setEvaluationsDetails] = useState(false);
  const [commandesDetails, setCommandesDetails] = useState(false);
  const [receptionsDetails, setReceptionsDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleItemClick = (type: string, item: any) => {
    switch (type) {
      case "Articles":
        setArticlesDetails(true);
        setSelectedItem(item);
        break;
      case "Lots":
        setLotsDetails(true);
        break;
      case "Consultations liées":
        setConsultationsDetails(true);
        setSelectedItem(item);
        break;
      case "Offres":
        setOffresDetails(true);
        setSelectedItem(item);
        break;
      case "Évaluations":
        setEvaluationsDetails(true);
        setSelectedItem(item);
        break;
      case "Commandes":
        setCommandesDetails(true);
        setSelectedItem(item);
        break;
      case "Réceptions":
        setReceptionsDetails(true);
        setSelectedItem(item);
        break;
      default:
        break;
    }
    setOpen(false); 
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full">
        <input
          type="text"
          placeholder="Rechercher par id_article ou id_lot..."
          className="bg-transparent outline-none w-full text-sm text-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-900 transition-colors flex gap-2 items-center"
        >
          <Search size={18}/> Rechercher
        </button>
      </div>

      {loading && <Loading />}

      {open && results && (
        <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg border z-50">
          {[
            {
              title: "Articles",
              items: results.articles,
              render: (a: any) =>
                `${a.designation} (ID: ${a.id_article}, DA: ${a.id_da})`,
            },
            {
              title: "Lots",
              items: results.lots,
              render: (l: any) => `Lot ${l.id_lot}`,
            },
            {
              title: "Consultations liées",
              items: results.consultations,
              render: (c: any) => `Consultation ${c.id_consultation}`,
            },
            {
              title: "Offres",
              items: results.offres,
              render: (o: any) =>
                `Offre ${o.id_offre} - Fournisseur ${o.id_fournisseur}`,
            },
            {
              title: "Évaluations",
              items: results.evaluations,
              render: (e: any) =>
                `Évaluation ${e.id_eval} (Date ${e.date.slice(0, 10)})`,
            },
            {
              title: "Commandes",
              items: results.commandes,
              render: (c: any) =>
                `Commande ${c.id_commande} (Date ${c.date.slice(0, 10)})`,
            },
            {
              title: "Réceptions",
              items: results.receptions,
              render: (r: any) =>
                `Réception ${r.id_reception} (Date ${r.date.slice(0, 10)})`,
            },
          ].map(
            (section) =>
              section.items?.length > 0 && (
                <div key={section.title} className="border-b last:border-b-0">
                  <h2 className="font-semibold text-blue-800 px-4 py-2 bg-gray-50 sticky top-0 z-10">
                    {section.title}
                  </h2>
                  {section.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleItemClick(section.title, item)}
                    >
                      {section.render(item)}
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      )}
      {articlesDetails && (
        <ArticlesDetail
          article={selectedItem}
          onClose={() => {
            setArticlesDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
      {consultationsDetails && (
        <ConsultationDetail
          consultation={selectedItem}
          onClose={() => {
            setConsultationsDetails(false);
            setSelectedItem(null);
          }}
          isOpen={consultationsDetails}
        />
      )}
      {offresDetails && (
        <OffreDetail
          id_offre={selectedItem.id_offre}
          onClose={() => {
            setOffresDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
      {evaluationsDetails && (
        <EvalDetail
          id_evaluation={selectedItem.id_eval}
          onClose={() => {
            setEvaluationsDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
      {commandesDetails && (
        <CommandeDetail
          id_commande={selectedItem.id_commande}
          onClose={() => {
            setCommandesDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
      {receptionsDetails && (
        <ReceptionDetail
          id_reception={selectedItem.id_reception}
          onClose={() => {
            setReceptionsDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default GlobalSearch;
