import React from "react";
import TableConsultation from "../components/TableConsultation";

const Consultation = () => {
  

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
      <div className="flex justify-between mb-4 items-center border-b-2 border-gray-200 pb-4">
        <h2 className="text-xl  font-semibold text-gray-800 ">Consultation</h2>
      </div>
      <TableConsultation />
      
    </div>
  );
};

export default Consultation;
