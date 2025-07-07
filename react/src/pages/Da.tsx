import React from "react";
import SideBar from "../components/SideBar";
import TableDA from "../components/TableDA";
import Header from "../components/Header";
import DaHead from "../components/DaHead";



function Da() {
  return (
    <>
      <div className="flex h-screen ">
        <div className="mr-60">
          <SideBar />
        </div>
        <div className="flex-1 px-6 py-6 flex flex-col ">
          <div className="flex-1 mb-10">
            <Header username="Nader Ben Salah" userrole="Admin" />
          </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <DaHead/>
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
    </>
  );
}
export default Da;