import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TableConsultation from "../components/TableConsultation";
import { consultationType } from "../types/consultationType";

const Consultation = () => {
  const location = useLocation();
  const [initialConsultation, setInitialConsultation] =
    useState<consultationType | null>(null);

  useEffect(() => {
    const state = location.state as { consultation?: consultationType };
    if (state?.consultation) {
      setInitialConsultation(state.consultation);
    }
  }, [location.state]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
      <div className="flex justify-between mb-4 items-center border-b-2 border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Consultation</h2>
      </div>

      <TableConsultation openConsultation={initialConsultation} />
    </div>
  );
};

export default Consultation;
