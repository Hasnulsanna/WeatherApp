

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserInfo } from './services/api';
import './SavedWeatherData.css';
import { saveAs } from 'file-saver';
import { FaDownload, FaTrash } from 'react-icons/fa';


const SavedWeatherData = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = getUserInfo();

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/weather/weather-data?username=${username}`);
                setWeatherData(response.data);  
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch weather data. Please try again later.');
                setLoading(false);
            }
        };
    
        fetchWeatherData();
    }, [username]);

    const handleDelete = async (entryId) => {
        try {
            await axios.delete(`http://localhost:8000/weather/delete-weather/${entryId}`);
            setWeatherData(weatherData.filter(entry => entry.id !== entryId));
        } catch (error) {
            setError('Failed to delete entry. Please try again.');
        }
    };

    const handleDownload = () => {
        const csvData = [
            ['Location', 'Date', 'Temp Max (°C)', 'Temp Min (°C)', 'Avg Temp (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
            ...weatherData.map(entry => [
                entry.location,
                entry.datetime || 'N/A',
                entry.temp_max || 'N/A',
                entry.temp_min || 'N/A',
                entry.avg_temp || 'N/A',
                entry.humidity || 'N/A',
                entry.wind_speed || 'N/A'
            ])
        ];
    
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'weather_data.csv');
        alert('✅ Weather data successfully downloaded!');
    };
    

    if (loading) return <p>Loading weather data...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="saved-weather-container">
            <h2>Saved Weather Data</h2>
            <div className="button-container">
                <button className="download-btn" onClick={handleDownload}>
                    <FaDownload className="icon" /> Download CSV
                </button>
            </div>
            {weatherData.length === 0 ? (
                <p>No weather data found.</p>
            ) : (
                <div className="weather-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Temp Max (°C)</th>
                                <th>Temp Min (°C)</th>
                                <th>Avg Temp (°C)</th>
                                <th>Humidity (%)</th>
                                <th>Wind Speed (m/s)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {weatherData.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.location}</td>
                                <td>{entry.datetime || 'N/A'}</td>
                                <td>{entry.temp_max || 'N/A'}</td>
                                <td>{entry.temp_min || 'N/A'}</td>
                                <td>{entry.avg_temp || 'N/A'}</td>
                                <td>{entry.humidity || 'N/A'}</td>
                                <td>{entry.wind_speed || 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleDelete(entry.id)} className="delete-btn">
                                        <FaTrash className="icon" /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                </div>
            )}
        </div>
    );
};

export default SavedWeatherData;
