import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Da from "./pages/Da";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SideBar from "./components/SideBar";
import Layout from "./components/Layout";
import Parametre from "./pages/Parametre";
import SidebarOnlyLayout from "./components/SideBarOnly";
import Article from "./pages/Article";
import Offre from "./pages/Offre";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="da" element={<Da />} />
          <Route path="article" element={<Article />} />
          <Route path="offre" element={<Offre />} />
          
        </Route>
        <Route path="/parametre" element={<SidebarOnlyLayout />} >
          <Route index element={<Parametre />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
