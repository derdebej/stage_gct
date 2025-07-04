import React from "react";
import logo from "../assets/Groupe_chimique_tunisien.jpg";

const Login = () => {
  return (
    <div className=" bg-white p-8 rounded-2xl shadow-md w-full max-w-md border-1 border-gray-400">
      <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
        Connexion
      </h2>

      <form className="space-y-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter votre email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Entrer votre mot de passe"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <div className="text-center text-xs text-gray-500 mt-2 mb-4">
          Mot de passe oublié?
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white font-semibold py-2 rounded-md hover:bg-blue-900 transition"
        >
          Se connecter
        </button>
        <div className="text-center text-sm text-gray-500 mt-4">
          Vous n’avez pas de compte ?{" "}
          <span className="font-bold text-black">Inscrivez-vous</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
