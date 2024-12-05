import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faPlus, faKey, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.scss';

const Navbar = ({ isconnect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      {isconnect && (
        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <NavLink className="navlink" to="">
              <img src="panda.png" alt="logo" />
            </NavLink>
            <NavLink className="navlink" to="/">
              <FontAwesomeIcon icon={faListAlt} className="icon" />
            </NavLink>
            <NavLink className="navlink" to="/addnotes">
              <FontAwesomeIcon icon={faPlus} className="icon" />
            </NavLink>
            <NavLink className="navlink" to="/reset-password">
              <FontAwesomeIcon icon={faKey} className="icon" />
            </NavLink>
            <NavLink className="navlink logout" to="/logout">
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            </NavLink>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
