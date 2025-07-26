import React, { useState } from "react";

const ProfileEdit = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user?.nom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState(
    user?.date_de_naissance?.slice(0, 10) || ""
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const res = await fetch(`http://localhost:3001/api/utilisateur/${user.id_utilisateur}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: name,
          email: email,
          date_de_naissance: birthDate,
          ...(password && { password }),
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil");

      const updated = await res.json();
      setMessage("Profil mis à jour avec succès");
      setMessageType("success");

      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du profil");
      setMessageType("error");
    }
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  
  };

  return (
    <div className="px-10 w-5xl max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm mt-10">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Modifier le Profil
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom et Prénom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Entrer votre nouveau mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de naissance
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-md mt-4 hover:bg-blue-800 transition"
        >
          Enregistrer
        </button>
      </form>
      {message && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white ${
            messageType === "success" ? "bg-green-400" : "bg-red-400"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
