import React from "react";
import logo from "../assets/Groupe_chimique_tunisien.jpg";
import { LayoutDashboard ,ShoppingCart , PackageSearch , Handshake , NotebookPen , Tags ,Settings , LogOut} from "lucide-react";

const SideBar = () => {
  return (
    <>
      <div className="fixed top-0 lef-0 w-55 h-screen bg-white shadow-sm flex flex-col justify-between rounded-r-3xl py-6 px-4">
        <div>
          <div className="mb-5 flex justify-center">
            <img src={logo} alt="GCT logo" className="h-20 object-contain" />
          </div>
          <nav className="flex flex-col gap-4 pl-2">
            <button className="flex gap-2 text-sm font-medium text-white bg-blue-900 rounded-lg px-2 py-2 text-left">
               <LayoutDashboard size={18}/>Tableau de bord
            </button>
            <button className="flex gap-2 text-sm  text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 px-2 ">
              <ShoppingCart size={18} /> Demandes d’achats
            </button>
            <button className="flex gap-2 text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 px-2 ">
              <PackageSearch size={18} /> Articles
            </button>
            <button className="flex gap-2 text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 px-2 ">
              <Tags size={18} /> Offres
            </button>
            <button className="flex gap-2 text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 px-2 ">
              <NotebookPen size={18} /> Évaluations
            </button>
            <button className="flex gap-2 text-sm text-gray-700 text-left hover:text-blue-900 hover:bg-gray-100 hover:rounded-lg py-2 px-2 ">
              <Handshake size={18} /> Commandes
            </button>
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-gray-300 pt-4">
          <button className="flex gap-1 text-sm text-gray-700 text-left hover:text-blue-900">
            <Settings size={16} /> Paramètres
          </button>
          <button className="flex gap-1 text-sm text-gray-700 text-left hover:text-blue-900">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
