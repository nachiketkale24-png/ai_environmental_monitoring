import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ZoneDetail from './pages/ZoneDetail';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/zone/:zoneId" element={<ZoneDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
