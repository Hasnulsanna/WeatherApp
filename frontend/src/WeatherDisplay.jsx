

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WeatherDisplay.css';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import { FaCloudSun, FaCloudRain, FaSmog, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

const WeatherDisplay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { weatherData, startDate, endDate, lat, lon, username } = location.state || {};  // Extract data from state

    const [forecastData, setForecastData] = useState(null);
    const [showForecast, setShowForecast] = useState(false);
    const [dateWeatherData, setdateWeatherData] = useState([]);
    const METEOSTAT_API_KEY = process.env.REACT_APP_METEOSTAT_API_KEY;
    const OPEN_WEATHER_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;


    useEffect(() => {
        if (!lat || !lon || !startDate || !endDate) return;
        

        const fetchWeatherByDateRange = async () => {
            try {
                // Format dates correctly for the API
                console.log('Start Date:', startDate);  // Debugging Tip: Verify start date
                console.log('End Date:', endDate);      // Debugging Tip: Verify end date
                
                const startDateFormatted = startDate; // Keep in 'YYYY-MM-DD'
                const endDateFormatted = endDate;     // Keep in 'YYYY-MM-DD'
        
                const response = await axios.get(
                    `https://meteostat.p.rapidapi.com/point/daily`,
                    {
                        params: {
                            lat: lat,
                            lon: lon,
                            start: startDateFormatted,
                            end: endDateFormatted
                        },
                        headers: {
                            'X-RapidAPI-Key': METEOSTAT_API_KEY,
                            'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
                        }
                    }
                );
        
                console.log('API Response:', response.data); // Debugging Tip: Verify response structure
        
                const fetchedData = response.data.data.map(entry => ({
                    datetime: entry.date,
                    main: {
                        temp_max: entry.tmax,
                        temp_min: entry.tmin,
                        temp: (entry.tmax + entry.tmin) / 2,
                        humidity: entry.rhum
                    },
                    wind: {
                        speed: entry.wspd
                    }
                }));
        
                setdateWeatherData(fetchedData);
            } catch (error) {
                console.error('Error fetching weather data for the selected date range:', error);
            }
        };
        
        fetchWeatherByDateRange();
        
    }, [lat, lon, startDate, endDate]);

    useEffect(() => {
        console.log('Weather Data Received:', weatherData);

        const fetchForecast = async () => {
            if (!weatherData) return;   // Prevents API call if data is undefined
            const { lat, lon } = weatherData.coord;
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
                );
                setForecastData(response.data.list);
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };
        fetchForecast();
    }, [weatherData]);

    if (!weatherData) return <p>No weather data available. Please validate your location first.</p>;

    const handleSaveWeatherData = async () => {
        try {
            for (const entry of dateWeatherData) {
                const payload = {
                    username: username,
                    location: weatherData.name,
                    datetime: entry.datetime,
                    temp_max: entry.main.temp_max ?? 0,
                    temp_min: entry.main.temp_min ?? 0,
                    avg_temp: entry.main.temp ?? 0,
                    humidity: entry.main.humidity ?? 0,
                    wind_speed: entry.wind.speed ?? 0
                };
                console.log('Payload Sent:', payload);
                await axios.post('http://localhost:8000/weather/save-weather', payload);
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Saved Successfully!',
                html: `
                    Weather data has been saved successfully.<br/>
                    <a href="/saved-weather" style="color: #4a90e2; text-decoration: underline;">➡️ View Saved Data</a>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#4caf50'
            });
        } catch (error) {
            console.error('Error saving weather data:', error);
            alert('Failed to save weather data. Please try again.');
        }
    };
    
    
    const getWeatherIcon = (description) => {
        if (description.includes('cloud')) return <FaCloudSun />;
        if (description.includes('rain')) return <FaCloudRain />;
        if (description.includes('mist') || description.includes('fog')) return <FaSmog />;
        return <FaCloudSun />; // Default icon
    };

    return (
        <div className='weather-display-container'>
            <h2>Weather Information for {weatherData.name}</h2>
            <div className="current-weather">
                <p><WiThermometer /> Temperature: {weatherData.main.temp}°C</p>
                <p><WiHumidity /> Humidity: {weatherData.main.humidity}%</p>
                <p><WiStrongWind /> Wind Speed: {weatherData.wind.speed} m/s</p>
                <p>Condition: {getWeatherIcon(weatherData.weather[0].description)} {weatherData.weather[0].description}</p>
            </div>

            <div className='weather-display-container'>
                <h2>Weather Data for Selected Dates</h2>
                {dateWeatherData.length > 0 ? (
                    dateWeatherData.map((entry, index) => (
                        <div key={index} className="weather-card">
                            <p>Date: {new Date(entry.datetime).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                            <p>Max Temperature: {entry.main.temp_max}°C</p>
                            <p>Min Temperature: {entry.main.temp_min}°C</p>
                            <p>Average Temperature: {entry.main.temp}°C</p>
                            <p>Humidity: {entry.main.humidity}%</p>
                            <p>Wind Speed: {entry.wind.speed} m/s</p>
                        </div>
                    ))
                ) : (
                    <p>weather data unavailable for the selected dates.</p>
                )}
            </div>

            <div className="button-container">   
            <button className="forecast-button" onClick={() => setShowForecast(true)}>5-Day Forecast</button>
            {showForecast && (
                <div className="forecast-overlay">
                    <div className="forecast-card">
                        <h3>🌦️ 5-Day Forecast</h3>
                        {forecastData.map((item, index) => (
                            <div key={index} className="forecast-card-item">
                                <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                                <p>Temp: {item.main.temp}°C</p>
                                <p>{getWeatherIcon(item.weather[0].description)} {item.weather[0].description}</p>
                            </div>
                        ))}
                        
                        <button className="close-button" onClick={() => setShowForecast(false)}>Close</button>
                    </div>
                </div>
            )}
            <button className="save-button" onClick={handleSaveWeatherData}>
                <FaSave /> Save
            </button>
            <button className="back-button" onClick={() => navigate(-1)}>🔙 Back</button>
        </div>
        </div>
    );
}

export default WeatherDisplay;
