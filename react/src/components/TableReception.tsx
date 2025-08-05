import React from "react";
import { useState } from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import { reception } from "../types/Reception";
interface props {
  receptions: reception[];
}

const TableReception = ({ receptions }: props) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="rounded-l-xl text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              ID
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Id Commande
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Id Lot
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Date reception
            </th>
            <th className="text-center py-3 px-4 text-sm text-gray-800 bg-gray-100">
              Montant recue
            </th>
            <th className="rounded-r-xl text-center py-3 px-4 text-sm  text-gray-800 bg-gray-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {receptions.map((reception) => (
            <tr
              key={reception.id_reception}
              className="bg-white rounded hover:bg-gray-50"
            >
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.id_reception}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.id_commande}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                a ajouter
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.date.slice(0, 10)}
              </td>
              <td className="text-center py-3 px-4 text-sm text-gray-700">
                {reception.montant_recue}
              </td>

              <td className="px-4 py-2 flex gap-2 justify-center">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  title="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                  //onClick={() => openConfirm(evalItem.id_eval)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {confirmOpen && (
        <ConfirmModal
          isOpen={confirmOpen}
          message={
            <>
              <p className="text-xl mb-4 border-b pb-4 border-b-gray-300">
                Supprimer cette évaluation ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </>
          }
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}*/}
    </div>
  );
};

export default TableReception;
