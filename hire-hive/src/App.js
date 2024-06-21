
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      <div className="app-container">
        <Footer />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/other" element={<OtherPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
