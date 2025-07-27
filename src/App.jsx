import React from 'react';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import { Route, Routes } from 'react-router-dom';


const App = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>  
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/journal" element={<JournalPage/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App