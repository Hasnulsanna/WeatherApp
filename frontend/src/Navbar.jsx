import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaSave, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem('username'); // Remove username if stored
            sessionStorage.clear(); // Clear session storage if used
            navigate('/login');
        }
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">WeatherApp|Hasnul Sanna</div>
            <ul className="navbar-links">
                <li><Link to="/weather"><FaHome /> Home</Link></li>
                <li><Link to="/saved-weather"><FaSave /> Saved Data</Link></li>
                <li><Link to="/about"><FiInfo /> About</Link></li> 
                <li onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</li>
            </ul>
        </nav>
    );
};

export default Navbar;
