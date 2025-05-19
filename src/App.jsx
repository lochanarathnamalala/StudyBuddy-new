// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Section from './Section';
import './App.css';
import Navbar from './Navbar';
import Write from './Write';
import MyStories from './MyStories';  // Import the new MyStories component

// Hero Section component
function HeroSection() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="background">
        {/* Colorful floating blobs */}
        <div className="blob pink"></div>
        <div className="blob blue"></div>
        <div className="blob yellow"></div>

        {/* Main hero section */}
        <div className="hero glass">
          <h1 className="typing-text">📖 Create Your Own Storybook</h1>
          <p className="fade-in">
            Let your imagination come alive — add drawings, voice, and flip pages!
          </p>
          <button className="start-btn fade-in" onClick={() => navigate('/categories')}>
            🚀 Start Writing
          </button>
        </div>
      </div>
    </>
  );
}

// App component with routing
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/categories" element={<Section />} />
        <Route path="/write" element={<Write />} />
        <Route path="/mystories" element={<MyStories />} />  {/* Add route for MyStories */}
      </Routes>
    </Router>
  );
}
