import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import WeatherEntry from './WeatherEntry';
import WeatherDisplay from './WeatherDisplay';
import Navbar from './Navbar';
import SavedWeatherData from './SavedWeatherData';
import About from './About';


function AppLayout() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/signup'];
  return (
      <div className='app-container'>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="app-content">
        <Routes>
          <Route path="/" element ={<WelcomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<RegisterPage />}/>
          <Route path="/weather" element={<WeatherEntry/>}/>
          <Route path ="/weather-info" element={<WeatherDisplay/>}/>
          <Route path ="/saved-weather" element={<SavedWeatherData/>}/>
          <Route path ="/about" element={<About/>}/>
        </Routes>
      </div>
      </div>
  );
}

function App() {
  return (
      <Router>
          <AppLayout />
      </Router>
  );
}


export default App;
