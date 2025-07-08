import React from "react";
import { Camera } from "lucide-react";
import avatar from "../exemples/nad-blue.png"

const ProfileEdit = () => {
  return (
    <div className="px-10 w-5xl max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-center text-2xl font-semibold mb-6">Modifier le Profil</h2>

      
      <div className="relative w-32 h-32 mx-auto mb-6">
        <img
          src={avatar} 
          alt="Profile"
          className="rounded-full object-cover w-full h-full"
        />
        <div className="absolute bottom-1 right-1 bg-gray-100 p-2 rounded-full shadow-md cursor-pointer">
          <Camera size={16} className="text-gray-600" />
        </div>
      </div>

     
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
          <input
            type="text"
            defaultValue="Nader Ben Salah"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue="*****@gmail.com"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            defaultValue="************"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
          <input
            type="date"
            defaultValue="2003-08-19"
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200">
            <option>Admin</option>
            <option>Utilisateur</option>
            <option>Responsable</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-md mt-4 hover:bg-blue-800 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
