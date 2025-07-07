import React from "react";

const DaHeadDashboard = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Demandes d'achats
        </h2>
        <select className="border rounded-md px-3 py-1 text-sm text-gray-700">
          <option value="janvier">Janvier</option>
          <option value="février">Février</option>
          <option value="mars">Mars</option>
          <option value="avril">Avril</option>
          <option value="mai">Mai</option>
          <option value="juin">Juin</option>
          <option value="juillet">Juillet</option>
          <option value="août">Août</option>
          <option value="septembre">Septembre</option>
          <option value="octobre">Octobre</option>
          <option value="novembre">Novembre</option>
          <option value="décembre">Décembre</option>
        </select>
      </div>
    </>
  );
};

export default DaHeadDashboard;
