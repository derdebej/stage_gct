import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Box from "../components/Box";
import { LineChart, CircleDollarSign } from "lucide-react";
import TableDA from "../components/TableDA";
import DaHeadDashboard from "../components/DaHeadDashboard";
import { useEffect, useState } from "react";
import { DA } from "../types/DA";
import { TopArticles, TopFournisseurs } from "../components/Top";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [data, setData] = useState<DA[]>([]);
  const [month, setMonth] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const fetchData = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (month) params.append("month", month);

    try {
      const res = await fetch(`${baseUrl}/api/demandes?${params.toString()}`);
      const result = await res.json();
      setData(result.data);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/dashboard/stats`);
        const data = await res.json();
        console.log("Stats:", data);
        setStats(data);
      } catch (err) {
        console.error("Erreur lors du chargement des stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, month]);
  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <>
      <div className="flex h-screen ">
        <div className="flex-1 px-6  flex flex-col ">
          <div className="flex-5">
            <div className="border-b w-min text-3xl font-bold text-gray-800 border-gray-300 mb-6 mt-6 pb-3">
              Dashboard
            </div>
            <div className="flex justify-between items-center pb-6 flex-1 border-b border-gray-300 space-x-4">
              <div>
                <Box
                  titre="Total de Dépenses"
                  valeur={`${stats.totalDepenses.toLocaleString()} dt`}
                  icon={
                    <CircleDollarSign className="w-6 h-6 text-indigo-600" />
                  }
                  variation="8.5%"
                  variationText="Par rapport au dernier mois"
                />
              </div>
              <div>
                <Box
                  titre="Nombre de Commandes"
                  valeur={stats.nombreCommandes}
                  icon={<LineChart className="w-6 h-6 text-indigo-600" />}
                  variation="8.5%"
                  variationText="Par rapport à la dernière année"
                />
              </div>
              <div>
                <TopArticles topArticles={stats.topArticles} />
              </div>
              <div>
                <TopFournisseurs topFournisseurs={stats.topFournisseurs} />
              </div>
            </div>
            <div className="mt-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <DaHeadDashboard
                  setPage={setPage}
                  month={month}
                  setMonth={setMonth}
                />
                <TableDA
                  onUpdate={fetchData}
                  totalPages={totalPages}
                  setPage={setPage}
                  page={page}
                  data={data}
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
                    {
                      header: "Status",
                      key: "etat",
                      render: (value: string) => {
                        let colorClass = "";
                        switch (value) {
                          case "Traitée":
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-green-100 text-green-800";
                            break;
                          case "En Cours":
                            colorClass =
                              "text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-800";
                            break;
                          case "Non Traitée":
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
