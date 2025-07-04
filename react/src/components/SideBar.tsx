import React from "react";
import logo from "../assets/Groupe_chimique_tunisien.jpg";

const SideBar = () => {
  return (
    <>
      <div className="fixed top-0 lef-0 w-55 h-screen bg-white shadow-sm flex flex-col justify-between rounded-r-3xl py-6 px-4">
        <div>
          <div className="mb-5 flex justify-center">
            <img src={logo} alt="GCT logo" className="h-20 object-contain" />
          </div>
          <nav className="flex flex-col gap-4">
            <button className="text-sm font-medium text-white bg-blue-900 rounded-lg py-2 px-8 text-left">
              Tableau de bord
            </button>
            <button className="text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 ">
              Demandes d’achats
            </button>
            <button className="text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 ">
              Articles
            </button>
            <button className="text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 ">
              Offres
            </button>
            <button className="text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 ">
              Évaluations
            </button>
            <button className="text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 ">
              Commandes
            </button>
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t pt-4">
          <button className="text-sm text-gray-700 text-left hover:text-blue-900">
            Paramètres
          </button>
          <button className="text-sm text-gray-700 text-left hover:text-blue-900">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
