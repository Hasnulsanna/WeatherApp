import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className='welcome-container'>
        <h1>🌦️WelcomePage</h1>
        <p>Your go-to app for real-time weather updates and forecasts!</p>
        <div className='button-group'>
            <Link to="/login">
                <button className='btn-welcome'>Login</button>
            </Link>
            <Link to="/signup">
                <button className='btn-welcome'>Signup</button>
            </Link>
        </div>
    </div>
  )
}

export default WelcomePage
