import React from "react";
import SideBar from "../components/SideBar";
import TableDA from "../components/TableDA";
import Header from "../components/Header";
import DaHead from "../components/DaHead";

function Da() {
  return (
    <>
      <div className="flex h-screen mb-4">
        <div className="flex-1 px-6 py-6 flex flex-col ">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <DaHead />
            <TableDA
              columns={[
                { header: "ID", key: "id" },
                { header: "Titre", key: "titre" },
                { header: "Date", key: "date" },
                { header: "Lots", key: "lots" },
                { header: "Prix", key: "prix" },
                { header: "Nature", key: "Nature" },
                { header: "Demandeur", key: "Demandeur" },
                { header: "Chemin Fichier", key: "cheminFichier" },

                {
                  header: "Status",
                  key: "statut",
                  render: (value: string) => {
                    let colorClass = "";
                    switch (value) {
                      case "Traité":
                        colorClass = "text-xs font-semibold px-3 py-1 bg-green-100 text-green-800";
                        break;
                      case "En Attente":
                        colorClass = "text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800";
                        break;
                      case "Non Traité":
                        colorClass = "text-xs font-semibold px-3 py-1 bg-red-100 text-red-800";
                        break;
                      default:
                        colorClass = "text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-800";
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
                  Articles: [
                    {
                      id: "1",
                      designation: "Article 1",
                      description: "Description de l'article 1",
                      prixUnitaire: "100 dt",
                      
                    },
                    {
                      id: "2",
                      designation: "Article 2",
                      description: "Description de l'article 1",
                      prixUnitaire: "200 dt",
                      
                    },
                  ],
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
