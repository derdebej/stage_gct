import React, { use } from "react";
import SideBar from "../components/SideBar";
import TableDA from "../components/TableDA";
import Header from "../components/Header";
import DaHead from "../components/DaHead";
import { DA } from "../types/DA";
import { useState } from "react";

function Da() {
  const [selectedRows, setSelectedRows] = useState<DA[]>([]);
  return (
    <>

      <div className="flex h-screen mb-4 ">
        <div className="flex-1 px-6 py-6 flex flex-col ">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <DaHead selectedRows={selectedRows}/>
            <TableDA
              onSelectionChange={setSelectedRows}
              selectedRows={selectedRows}
              columns={[
                { header: "ID", key: "id_da" },
                { header: "Titre", key: "titre" },
                { header: "Date", key: "date_creation" },
                { header: "Nombre des Lots", key: "nbre" },
                { header: "Montant", key: "montant_estime", 
                  render: (value: string) => {
                    return value ? `${value} dt` : "N/A";
                  }
                 },
                { header: "Nature", key: "nature" },
                { header: "Demandeur", key: "demandeur" },
                { header: "Chemin Fichier", key: "chemin_da" },

                {
                  header: "Status",
                  key: "statut",
                  render: (value: string) => {
                    let colorClass = "";
                    switch (value) {
                      case "Traité":
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 whitespace-nowrap";
                        break;
                      case "En Attente":
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 whitespace-nowrap";
                        break;
                      case "Non Traité":
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-red-100 text-red-800 whitespace-nowrap";
                        break;
                      default:
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-800 whitespace-nowrap";
                    }

                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${colorClass}`}
                      >
                        {value}
                      </span>
                    );
                  },
                },
              ]}
             
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default Da;
