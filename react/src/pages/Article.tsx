import React from "react";
import TableArticle from "../components/TableArticle";
import { Search, FilePlus } from "lucide-react";

const Article = () => {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex justify-between mb-4 items-center border-b-2 border-gray-200 pb-4">
          <h2 className="text-xl  font-semibold text-gray-800 ">Articles</h2>
          <button className="cursor-pointer bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm">
            <FilePlus className="w-4 h-4" />
            Ajouter un Article
          </button>
        </div>
        <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1  border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher Article par ID , Designation , Description ... , "
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        <TableArticle
          data={[
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
            {
              id: "123",
              designation: "ddd",
              description: "ffff",
              prixUnitaire: "123",
            },
          ]}
        />
      </div>
    </>
  );
};

export default Article;
