import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Box from "../components/box";
import { LineChart } from "lucide-react";
import TableDA from "../components/TableDA";
import DaHeadDashboard from "../components/DaHeadDashboard";

function Dashboard() {
  return (
    <>
      <div className="flex h-screen ">
        <div className="flex-1 px-6  flex flex-col ">
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
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <DaHeadDashboard />
                <TableDA
                  columns={[
                    { header: "ID", key: "id" },
                    { header: "Titre", key: "titre" },
                    { header: "Date", key: "date" },
                    { header: "Lots", key: "lots" },
                    { header: "Prix", key: "prix" },
                    {
                      header: "Status",
                      key: "statut",
                      render: (value: string) => {
                        let colorClass = "";
                        switch (value) {
                          case "Traité":
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-green-100 text-green-800";
                            break;
                          case "En Attente":
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800";
                            break;
                          case "Non Traité":
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-red-100 text-red-800";
                            break;
                          default:
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-800";
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
                  data={[
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "En Attente",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Non Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "En Attente",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Non Traité",
                    },
                    {
                      id: "1",
                      titre: "Achat 1",
                      date: "2023-10-01",
                      lots: 5,
                      prix: "1000 dt",
                      Nature: "Investisement",
                      Demandeur: "Nader Ben Salah",
                      cheminFichier: "chemin/vers/fichier.pdf",
                      statut: "Traité",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
