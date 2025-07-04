import React from "react";
import { Search, ChevronDown } from "lucide-react";
// @ts-ignore
import avatar from "../exemples/nad-blue.png";

interface HeaderProps {
  username?: string;
  userrole?: string;
  // el taswira
}

const Header = ({ username, userrole }: HeaderProps) => {
  return (
    <div className="bg-white p-4  rounded-2xl shadow-sm flex items-center justify-between w-full max-w-full">
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-xl flex-1 mr-4">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Rechercher"
          className="bg-transparent outline-none w-full text-sm text-gray-700"
        />
      </div>
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{username}</p>
          <p className="text-xs text-gray-500">{userrole}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
};

export default Header;
