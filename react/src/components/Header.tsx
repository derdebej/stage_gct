import React from "react";
import Card from "./Card";
import GlobalSearch from "./GlobalSearch";

interface HeaderProps {
  username?: string;
  userrole?: string;
}

const Header = ({ username, userrole }: HeaderProps) => {
  return (
    <div className="bg-white p-4  rounded-2xl shadow-sm flex items-center justify-between w-full max-w-full">
      <GlobalSearch />
      <Card username={username} userrole={userrole} />
    </div>
  );
};

export default Header;
