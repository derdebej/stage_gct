import React, { useEffect, useState } from "react";
import Box from "./Box";
import { LineChart, Package, Layers } from "lucide-react";

interface StatBoxProps {
  type: "consommable" | "equipement" | "aed";
  numAED?: string; // requis si type = "aed"
  baseUrl: string;
  nombre_commandes?: number;
  setNombreCommandes?: (nombre: number) => void;
}

const StatBox = ({ type, numAED, baseUrl,nombre_commandes,setNombreCommandes }: StatBoxProps) => {
  const [valeur, setValeur] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = "";

        if (type === "consommable") {
          url = `${baseUrl}/depense-consommable`;
        } else if (type === "equipement") {
          url = `${baseUrl}/depense-equipement`;
        } else if (type === "aed" && numAED) {
          url = `${baseUrl}/depense-aed/${numAED}`;
        }

        if (!url) return;

        const res = await fetch(url);
        const data = await res.json();

        setValeur(`${data.total} TND`);
        setNombreCommandes(data.nombre_commandes || 0);
      } catch (err) {
        console.error("Erreur fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [type, numAED, baseUrl]);

  if (loading) {
    return <Box titre="Chargement..." valeur="..." variation="" variationText="" />;
  }

  let titre = "";
  let icon = <LineChart className="w-6 h-6 text-indigo-600" />;

  if (type === "consommable") {
    titre = "Dépenses Consommables";
    icon = <Package className="w-6 h-6 text-indigo-600" />;
  } else if (type === "equipement") {
    titre = "Dépenses Équipements";
    icon = <Layers className="w-6 h-6 text-indigo-600" />;
  } else if (type === "aed") {
    titre = `Dépenses AED ${numAED}`;
    icon = <LineChart className="w-6 h-6 text-indigo-600" />;
  }

  return (
    <Box
      titre={titre}
      valeur={valeur}
      icon={icon}
      variation="" 
      variationText=""
    />
  );
};

export default StatBox;
