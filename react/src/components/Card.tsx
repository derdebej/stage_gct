import React from "react";
import { ChevronDown } from "lucide-react";
import avatar from "../exemples/nad-blue.png";
import { useState, useRef, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface CardProps {
  username?: string;
  userrole?: string;
}

const Card = ({ username, userrole }: CardProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
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
        <div
          onClick={() => setOpen(!open)}
          className=" cursor-pointer hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"
          aria-label="Toggle menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(!open);
          }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      {open && (
        <div
          ref={menuRef}
          className="absolute  top-full right-4 mt-2 w-36 py-3 bg-white shadow-sm border-1 border-gray-200 rounded-lg z-50"
        >
          <Link
            to="/parametre"
            className="flex gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-gray-700"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Settings size={18} className="mt-0.5" /> Settings
          </Link>
          <Link
            to="/login"
            className="flex gap-2 text-md px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
            onClick={() => {
              setOpen(false);
            }}
          >
            <LogOut size={18} className="mt-0.5" /> Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
