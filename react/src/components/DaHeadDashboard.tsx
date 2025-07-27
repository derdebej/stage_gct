import React from "react";

const DaHeadDashboard = ({ setMonth, month, setPage }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Demandes d'achats
        </h2>
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-3 py-1 text-sm text-gray-700"
        >
          <option value="">Tous</option>
          <option value="1">Janvier</option>
          <option value="2">Février</option>
          <option value="3">Mars</option>
          <option value="4">Avril</option>
          <option value="5">Mai</option>
          <option value="6">Juin</option>
          <option value="7">Juillet</option>
          <option value="8">Août</option>
          <option value="9">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>
      </div>
    </>
  );
};

export default DaHeadDashboard;
