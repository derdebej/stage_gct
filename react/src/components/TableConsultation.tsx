import React from 'react'
import { useState, useEffect} from 'react'
import { consultationType } from '../types/consultationType'
import { Eye, Pencil, Trash2 } from 'lucide-react'

const TableConsultation = () => {
  const [consultation, setConsultation] = useState<consultationType[]>([])
  useEffect(() => {
      fetch("http://localhost:3001/api/consultation")
        .then((res) => res.json())
        .then((data) => setConsultation(data))
        .catch((err) => console.error(err));
      console.log(consultation)
    }, []);
  return (
    <>
      <table className="w-full text-center border-separate border-spacing-0 ">
      <thead>
        <tr>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-l-xl">
            ID
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Date De Création
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm ">
            Nombre de Lots
          </th>
          <th className="bg-gray-100 py-3 px-4 text-gray-800 text-sm rounded-r-xl">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {consultation.map((row, idx) => (
          <tr key={idx} className="border-t hover:bg-gray-50 ">
            <td className="text-left py-3 px-4 text-sm text-gray-700 rounded-l-xl">
              {row.id_consultation}
            </td>
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              {row.date_creation}
            </td>
            
            <td className="text-left py-3 px-4 text-sm text-gray-700">
              
            </td>
            <td
              key={idx}
              className="flex justify-between items-center py-3 px-4 "
            >
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
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export default TableConsultation