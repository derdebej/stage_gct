import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-60 fixed h-screen z-10">
        <SideBar />
      </div>

      <div className="flex-1 ml-60 bg-transparent min-h-screen px-6 py-6">
        <Header username="Nader Ben Salah" userrole="Admin" />

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
