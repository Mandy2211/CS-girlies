import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';

const NavBar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className='navbar'>
        <div className="navbar-logo">
          <img src={logo} alt="DreamCanvas Logo" />
          <span className="navbar-title">DreamCanvas</span>
        </div>
        <ul>
          <Link to="/"><li>Home</li></Link>
          <Link to="/about"><li>About</li></Link>
          <Link to="/profile"><li>Profile</li></Link>
          <Link to="/journal"><li>Journal</li></Link>
        </ul>
        <button onClick={() => setModalOpen(true)}>Login</button>
      </div>
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default NavBar;