import Box from "./components/box";
import React, { useState } from "react";
import { LineChart, History } from "lucide-react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import TableDA from "./components/TableDA";

function App() {
  return (
    <>
      <div className="flex h-screen ">
        <div className="mr-60">
          <SideBar />
        </div>
        <div className="flex-1 px-6 py-6 flex flex-col ">
          <div className="flex-1">
            <Header username="Nader Ben Salah" userrole="Admin" />
          </div>
          <div className="flex-5">
            <div className="border-b w-min text-3xl font-bold text-gray-800 border-gray-300 mb-6 mt-6 pb-3">
              Dashboard
            </div>
            <div className="flex justify-between pb-6 flex-1 border-b  border-gray-300">
              <div className="flex-1">
                <Box
                  titre="Total Achats"
                  valeur="4,689 dt"
                  icon={<LineChart className="w-6 h-6 text-indigo-600" />}
                  variation="8.5%"
                  variationText="Par rapport au dernier mois"
                />
              </div>
              <div className="flex-1">
                <Box
                  titre="Total Achats"
                  valeur="4,689 dt"
                  icon={<LineChart className="w-6 h-6 text-indigo-600" />}
                  variation="8.5%"
                  variationText="Par rapport au dernier mois"
                />
              </div>
              <div className="flex-1">
                <Box
                  titre="Total Achats"
                  valeur="4,689 dt"
                  icon={<LineChart className="w-6 h-6 text-indigo-600" />}
                  variation="8.5%"
                  variationText="Par rapport au dernier mois"
                />
              </div>
              <div className="flex-1">
                <Box
                  titre="Total Achats"
                  valeur="4,689 dt"
                  icon={<LineChart className="w-6 h-6 text-indigo-600" />}
                  variation="8.5%"
                  variationText="Par rapport au dernier mois"
                />
              </div>
            </div>
            <div className="mt-6">
              <TableDA
                data={[
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "En Attente",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Non Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "En Attente",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Non Traité",
                  },
                  {
                    id: "1",
                    titre: "Achat 1",
                    date: "2023-10-01",
                    lots: 5,
                    prix: "1000 dt",
                    statut: "Traité",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
