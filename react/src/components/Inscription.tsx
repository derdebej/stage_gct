import React from "react";
import { useState } from "react";
import Loading from "./Loading";

const Inscription = ({ setInscription }) => {
  const [nomPrenom, setNomPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomPrenom,
          email,
          password,
          dateNaissance,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSignedUp(true);
        setSuccess("Compte créé avec succès 🎉");
        setTimeout(() => {
          setInscription(false);
        }, 1500);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white p-8 rounded-2xl shadow-md w-full max-w-md border-1 border-gray-400">
      <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
        Inscription
      </h2>
      {(loading || signedUp) && <Loading />}

      {!loading && !signedUp && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom et Prénom
            </label>
            <input
              type="text"
              onChange={(e) => setNomPrenom(e.target.value)}
              placeholder="Entrer votre nom et prénom"
              className={`mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-900 ${error ? "border-red-500" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrer votre email"
              className={`mt-1 w-full border  rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-900 ${error ? "border-red-500" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrer votre mot de passe"
              className={`mt-1 w-full border  rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-900 ${error ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              onChange={(e) => setDateNaissance(e.target.value)}
              value={dateNaissance}
              className={`mt-1 w-full border  rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-900 ${error ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-left mt-2">{error}</div>
          )}

          <div className="text-center text-sm text-gray-500 mt-4">
            Vous avez déja un compte ?{" "}
            <button
              onClick={() => setInscription(false)}
              className="font-bold text-black cursor-pointer"
            >
              Connectez-vous
            </button>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors duration-200"
          >
            S'inscrire
          </button>
        </form>
      )}
    </div>
  );
};

export default Inscription;
