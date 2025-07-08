
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const SidebarOnlyLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-60 fixed h-screen">
        <SideBar />
      </div>
      <div className="flex-1 ml-60  mb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarOnlyLayout;
