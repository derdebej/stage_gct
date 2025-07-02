import Box from "./components/box"
import React, { useState } from "react"
import { LineChart,History } from "lucide-react"
import Header from "./components/Header"

function App() {
  return (
    <>
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <Header username="Nader Ben Sala"  userrole="Admin"/>
    
    <div className="min-h-screen bg-gray-100  flex items-center justify-between p-6">
      
      <Box
        titre="Total Achats"
        valeur="4,689 dt"
        icon={<LineChart className="w-6 h-6 text-indigo-600" />}
        variation="8.5%"
        variationText="Par rapport au dernier mois"
      />
      <Box
        titre="Total Achats"
        valeur="4,689 dt"
        icon={<LineChart className="w-6 h-6 text-indigo-600" />}
        variation="8.5%"
        variationText="Par rapport au dernier mois"
      />
      <Box
        titre="Total Achats"
        valeur="4,689 dt"
        icon={<LineChart className="w-6 h-6 text-indigo-600" />}
        variation="8.5%"
        variationText="Par rapport au dernier mois"
      />
      <Box
        titre="Total Achats"
        valeur="4,689 dt"
        icon={<History className="w-6 h-6 text-indigo-600" />}
        variation=""
        variationText="Par rapport au dernier mois"
      />
    </div>
    </div>
    </>
  )
}

export default App
