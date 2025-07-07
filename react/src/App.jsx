import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Da from './pages/Da';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <Router>
      <div className="text-center p-6 space-x-4 ">
        
        <Link to="/">Login</Link>
        <Link to="/Da">DA</Link>
        <Link to="/Dashboard">Dshboard</Link>
      </div>

      
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Da" element={<Da />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}




export default App;
