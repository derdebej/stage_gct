import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Layout: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const username = user?.nom;
  const userrole = "Admin";

  return (
    <div className="flex min-h-screen">
      <div className="w-60 fixed h-screen z-10">
        <SideBar />
      </div>

      <div className="flex-1 ml-60 bg-transparent min-h-screen px-6 py-6">
        <Header username={username} userrole={userrole} />

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
