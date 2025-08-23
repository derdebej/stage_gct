import React from "react";
import { ArrowUpRight, LineChart, History } from "lucide-react";

interface BoxProps {
  titre: string;
  valeur: string;
  icon?: React.ReactNode;
  variation: string;
  variationText: string;
}

const Box = ({ titre, valeur, icon, variation, variationText }: BoxProps) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-5 w-sm max-w-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{titre}</p>
          <p className="text-2xl font-semibold text-gray-900">{valeur}</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-xl">
          {icon || <History className="w-6 h-6 text-indigo-600" />}
        </div>
      </div>
      {variation && (
        <div className="flex items-center gap-1 mt-4">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          <p className="text-sm">
            <span className="text-green-600 font-medium">{variation}</span>{" "}
            <span className="text-gray-700">{variationText}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Box;
