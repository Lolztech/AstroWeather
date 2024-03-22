import React, { useEffect, useState } from 'react';
import './todayModule.css';

export default function TodayModule({ lat, lon, name }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat && lon) {
        const apiKey = '4c9d83613e1f814a6c1d1f57c346b997'; // Replace with your OpenWeatherMap API Key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Weather data could not be fetched');
          }
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
          setWeatherData(null);
        }
      }
    };

    fetchWeatherData();
  }, [lat, lon, name]); // Effect runs when `lat` and `lon` props change

  // Get the current date and format it
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', // "Monday"
    year: 'numeric', // "2021"
    month: 'long', // "July"
    day: 'numeric', // "19"
  });

  return (
    <div className="Today__Container">
      {/* Display the formatted date */}
      <p className="white-text"> {name}</p>
      <p className="white-text">{currentDate}</p>
      {weatherData ? (
        <>
          <p className="white-text">{weatherData.weather[0].main}</p>
          <p className="white-text">{weatherData.main.temp}°C</p>
          {/* Display other weather data as needed */}
        </>
      ) : (
        <p className="white-text">No weather data available. Search for a location!</p>
      )}
    </div>
  );
}
