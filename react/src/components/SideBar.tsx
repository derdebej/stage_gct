import React from "react";
// @ts-ignore
import logo from "../assets/Groupe_chimique_tunisien.jpg";
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Handshake,
  NotebookPen,
  Tags,
  Settings,
  LogOut,
  File,
  CheckCheck
} from "lucide-react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import Da from "../pages/Da";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, loading } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="fixed top-0 lef-0 w-55 h-screen bg-white shadow-sm flex flex-col justify-between rounded-r-3xl py-6 px-4">
        <div>
          <div className="mb-5 flex justify-center">
            <img src={logo} alt="GCT logo" className="h-20 object-contain" />
          </div>
          <nav className="flex flex-col gap-4 pl-2">
            <Link
              to="/"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={18} />
              Tableau de bord
            </Link>
            <Link
              to="/da"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/da")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart size={18} />
              Demandes d’achats
            </Link>
            <Link
              to="/consultation"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/consultation")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <File size={18}/>
              Consultation
            </Link>

            <Link
              to="/article"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/article")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <PackageSearch size={18} /> Articles
            </Link>
            <Link
              to="/offre"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/offre")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <Tags size={18} /> Offres
            </Link>
            <Link
              to="/evaluation"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/evaluation")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <NotebookPen size={18} /> Évaluations
            </Link>
            <Link
              to="/commandes"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/commandes")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <Handshake size={18} /> Commandes
            </Link>
            <Link
              to="/reception"
              className={`flex gap-2 text-sm font-medium rounded-lg px-2 py-2 text-left ${
                isActive("/reception")
                  ? "text-white bg-blue-900"
                  : "text-gray-700 hover:text-blue-900 hover:bg-gray-100"
              }`}
            >
              <CheckCheck size={18}/> Reception
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-gray-300 pt-4">
          <Link
            to="/parametre"
            className="flex gap-1 text-sm text-gray-700 text-left hover:text-blue-900"
          >
            <Settings size={16} /> Paramètres
          </Link>
          <button
            onClick={handleLogout}
            className="flex gap-1 text-sm text-gray-700 text-left hover:text-blue-900 cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
