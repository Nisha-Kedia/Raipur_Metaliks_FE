import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import About from './components/About/About';
import Home from './components/Home/Home';
import Business from './components/Business/Business';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login';
import Welcome from './components/Welcome/Welcome';
import Chatbot from './components/Chatbot/Chatbot';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Dashboard from './components/Dashboard/Dashboard';
import Buyer from './components/Buyer/Buyer';


function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <About />
            <Business />
            <FAQ />
            <Contact />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path= "/buyer" element={<Buyer/>}/>
      </Routes> 
      <Chatbot />
    </Router>
  );
}

export default App;