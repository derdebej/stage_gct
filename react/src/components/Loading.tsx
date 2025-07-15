import React from 'react'

const Loading = () => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-sm">Chargement...</p>
  </div>
);

export default Loading