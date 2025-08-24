import React from "react";
import TableArticle from "../components/TableArticle";
import { Search, FilePlus } from "lucide-react";
import { useState } from "react";

const Article = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex justify-between mb-4 items-center border-b-2 border-gray-200 pb-4">
          <h2 className="text-xl  font-semibold text-gray-800 ">Articles</h2>
        </div>
        <div className="flex items-center bg-white mb-4 px-4 py-2 rounded-full w-full max-w-xl flex-1  border border-gray-300">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Rechercher par ID , Designation , Description ... , "
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        <TableArticle
          page={page}
          setPage={setPage}
          search={search}
          limit={limit}
        />
        
      </div>
    </>
  );
};

export default Article;
