import React, { use } from "react";
import SideBar from "../components/SideBar";
import TableDA from "../components/TableDA";
import Header from "../components/Header";
import DaHead from "../components/DaHead";
import { DA } from "../types/DA";
import { useState } from "react";
import { useEffect } from "react";

function Da() {
  const [selectedRows, setSelectedRows] = useState<DA[]>([]);
  const [filteredDAs, setFilteredDAs] = useState([]);
  const [search, setSearch] = useState("");
  const [etat, setEtat] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const handleDeleteFromParent = (id_da: string) => {
    setFilteredDAs((prev) =>
      // @ts-ignore
      prev.filter((da) => String(da.id_da) !== String(id_da))
    );
  };
  const fetchDemandes = async () => {
    let url = `http://localhost:3001/api/search?q=${search}`;
    if (etat) url += `&etat=${etat}`;
    if (year) url += `&year=${year}`;
    if (month) url += `&month=${month}`;
    if (day) url += `&day=${day}`;

    const res = await fetch(url);
    const data = await res.json();
    setFilteredDAs(data);
  };
  useEffect(() => {
    fetchDemandes();
  }, [search, etat, year, month, day]);

  return (
    <>
      <div className="flex h-screen mb-4 ">
        <div className="flex-1 px-6 py-6 flex flex-col ">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <DaHead
              onRefresh={fetchDemandes}
              setSelectedRows={setSelectedRows}
              selectedRows={selectedRows}
              search={search}
              setSearch={setSearch}
              etat={etat}
              setEtat={setEtat}
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
              day={day}
              setDay={setDay}
            />
            <TableDA
              onDelete={handleDeleteFromParent}
              data={filteredDAs}
              onSelectionChange={setSelectedRows}
              selectedRows={selectedRows}
              columns={[
                { header: "ID", key: "id_da" },
                { header: "Titre", key: "titre" },
                { header: "Date", key: "date" },
                {
                  header: "Montant",
                  key: "montant",
                  render: (value: string) => {
                    return value ? `${value} dt` : "N/A";
                  },
                },
                { header: "Nature", key: "nature" },
                { header: "Demandeur", key: "demandeur" },
                { header: "Chemin Fichier", key: "chemin_document" },

                {
                  header: "Status",
                  key: "etat",
                  render: (value: string) => {
                    let colorClass = "";
                    switch (value) {
                      case "Traitée":
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 whitespace-nowrap";
                        break;
                      case "En Cours":
                        colorClass =
                          "text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 whitespace-nowrap";
                        break;
                      case "Non Traitée":
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
