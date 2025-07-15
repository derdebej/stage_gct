import React from "react";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import logo from "../assets/Groupe_chimique_tunisien.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({setInscription}) => {
  


  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      // Success
      login(data.user);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  };

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
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter votre email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrer votre mot de passe"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm text-left mt-2">{error}</div>
        )}
        <div className="text-center text-xs text-gray-500 mt-2 mb-4">
          Mot de passe oublié?
        </div>

        <button
          onClick={handleLogin}
          type="submit"
          className="w-full cursor-pointer bg-blue-800 text-white font-semibold py-2 rounded-md hover:bg-blue-900 transition"
        >
          Se connecter
        </button>
        <div className="text-center text-sm text-gray-500 mt-4">
          Vous n’avez pas de compte ?{" "}
          <button onClick={()=>setInscription(true)} className="font-bold text-black cursor-pointer">Inscrivez-vous</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
