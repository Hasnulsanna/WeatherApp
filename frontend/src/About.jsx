import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './About.css';

const About = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleClose = () => {
        navigate('/weather'); // Redirect to the Home page
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>About PM Accelerator</h2>
                <p>
                    The Product Manager Accelerator Program is designed to support PM professionals 
                    through every stage of their careers. From students looking for entry-level jobs to 
                    Directors aiming for leadership roles, our program has helped hundreds of students 
                    achieve their career goals.
                </p>

                <h3>Our Services</h3>
                <ul>
                    <li>🚀 PMA Pro - FAANG-level PM skills & job referrals</li>
                    <li>🚀 AI PM Bootcamp - Hands-on AI product building</li>
                    <li>🚀 PMA Power Skills - PM & leadership training</li>
                    <li>🚀 PMA Leader - Accelerate your PM career growth</li>
                    <li>🚀 1:1 Resume Review with guaranteed interviews</li>
                </ul>

                <p>
                    Visit our website: 
                    <a 
                        href="https://www.pmaccelerator.io/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        www.pmaccelerator.io
                    </a>
                </p>

                <button className="close-btn" onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default About;
