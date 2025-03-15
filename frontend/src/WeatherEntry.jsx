

import React, { useState,useEffect } from 'react';
import { getUserInfo } from './services/api';
import './WeatherEntry.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WeatherDisplay from './WeatherDisplay';

const WeatherEntry = () => {
    const username = getUserInfo();
    const navigate = useNavigate();
    const [locationType, setLocationType] = useState('City/Town');
    const [locationInput, setLocationInput] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validatedLocation, setValidatedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
        setEndDate(today);
    }, []);

    const placeholderMapping = {
        'City/Town': 'Enter a city name (e.g., New York)',
        'Postal Code/Zip Code': 'Enter postal/zip code (e.g., 10001)',
        'GPS Coordinates': 'Enter coordinates (e.g., 40.7128, -74.0060)',
        'Regions/Provinces': 'Enter a region/province name',
    };

    const isValidDateRange = (start, end) => {
        const today = new Date();
        const selectedStartDate = new Date(start);
        const selectedEndDate = new Date(end);
    
        // Due to API Limit minimum start date (5 years before today)
        const minStartDate = new Date(today);
        minStartDate.setFullYear(today.getFullYear() - 5); 
    
        // Due to API Limit maximum end date (5 days after today)
        const maxEndDate = new Date(today);
        maxEndDate.setDate(today.getDate() + 5);
    
        // Validation checks
        if (
            !start || 
            !end || 
            selectedStartDate < minStartDate || 
            selectedEndDate > maxEndDate || 
            selectedStartDate > selectedEndDate
        ) {
            return false;
        }
        return true;
    };
    
    
    const handleValidation = async () => {
        const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
        let url = '';
        let locationData = null;
        setIsLoading(true);

        if (!isValidDateRange(startDate, endDate)) {
            alert(`Invalid date range. Ensure:
                - End date must be within 5 days from today.`);
            setIsLoading(false);
            return;
        }

        if (locationType === 'GPS Coordinates') {
            const [lat, lon] = locationInput.split(',').map(coord => coord.trim());
            url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
        } else if (locationType === 'Postal Code/Zip Code') {
            const country = prompt("Please enter the country code (e.g., US, IN, GB):");
            if (!country) {
                alert("Country code is required for ZIP code validation.");
                setIsLoading(false);
                return;
            }
            url = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(locationInput)},${country.toUpperCase().trim()}&appid=${API_KEY}`;
        }
         else {
            url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=1&appid=${API_KEY}`;
        }

        try {
            const response = await axios.get(url);
            console.log('API Response:', response);

            if (locationType === 'Postal Code/Zip Code') {
                if (response.data && Object.keys(response.data).length > 0) {
                    locationData = response.data;
                }
            } else if (response.data && response.data.length > 0) {
                locationData = response.data[0];
            }

            if (locationData) {
                const { lat, lon } = locationData;
                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                );

                const weatherData = {
                    name: locationData.name,
                    country: locationData.country,
                    coord: { lat, lon },
                    main: {
                        temp: weatherResponse.data.main.temp || 'N/A',
                        humidity: weatherResponse.data.main.humidity || 'N/A'
                    },
                    wind: {
                        speed: weatherResponse.data.wind.speed || 'N/A'
                    },
                    weather: weatherResponse.data.weather || [{ description: 'N/A' }]
                };

                setValidatedLocation(weatherData);
                navigate('/weather-info', { 
                    state: { 
                        weatherData,
                        lat: weatherData.coord.lat, 
                        lon: weatherData.coord.lon, 
                        startDate,
                        endDate,
                        username 
                    } 
                });
                
                alert(`Location Found: ${weatherData.name}, ${weatherData.country}`);
            } else {
                alert(`Location not found. Please enter a valid ${locationType}.`);
            }
        } catch (error) {
            console.error('API Error:', error.response || error.message);
            alert('Error validating location. Please try again later.');
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    const handleClearInputs = () => {
        setLocationInput('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="weather-entry-container">
            <h1>Welcome, {username}!</h1>
            <div className="quote-container">
                "Storms don't last forever; stay strong🌤️"
            </div>
            <div className="weather-form">
                <label>Select Location Type:</label>
                <select value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                {
                    Object.keys(placeholderMapping).map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))
                }
                </select>

                <label>Enter Location:</label>
                <input
                    type="text"
                    maxLength={100}
                    placeholder={placeholderMapping[locationType]}
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                />

                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <div className="button-group">
                    <button onClick={handleValidation} className="submit-btn" disabled={isLoading}>
                    {isLoading ? <span className="spinner"></span> : 'Submit'}
                    </button>
                    <button onClick={handleClearInputs} className="clear-btn">Clear</button>
                </div>
            </div>
            {validatedLocation && <WeatherDisplay weatherData={validatedLocation} />}
        </div>
    );
}

export default WeatherEntry;





