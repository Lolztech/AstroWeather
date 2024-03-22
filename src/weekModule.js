import React, { useEffect, useState } from 'react';
import './weekModule.css';

export default function WeekModule({ lat, lon }) {
  const [dailyForecasts, setDailyForecasts] = useState([]);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (lat && lon) {
        const apiKey = '4c9d83613e1f814a6c1d1f57c346b997'; // Use your actual API key
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Forecast data could not be fetched');
          }
          const data = await response.json();
          
          // Group data by day and calculate min/max temperatures
          const tempByDay = data.list.reduce((acc, cur) => {
            const date = new Date(cur.dt * 1000).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = { min: cur.main.temp_min, max: cur.main.temp_max, data: [cur] };
            } else {
              acc[date].min = Math.min(acc[date].min, cur.main.temp_min);
              acc[date].max = Math.max(acc[date].max, cur.main.temp_max);
              acc[date].data.push(cur);
            }
            return acc;
          }, {});

          // Convert the object into an array and keep the first item for each day
          const dailyForecasts = Object.keys(tempByDay).map(date => {
            const forecast = tempByDay[date];
            return {
              date,
              min: forecast.min,
              max: forecast.max,
              ...forecast.data[0]
            };
          });

          setDailyForecasts(dailyForecasts);
        } catch (error) {
          console.error('Failed to fetch forecast data:', error);
          setDailyForecasts([]);
        }
      }
    };

    fetchForecastData();
  }, [lat, lon]);

  return (
    <div className='Week__Container'>
      {dailyForecasts.length > 0 ? dailyForecasts.map((day, index) => {
        // Check if it's the first entry to display "Today"
        const displayDate = index === 0 ? "Today" : 
          new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });

        return (
          <div key={index} className='Week__Day'>
            <p className='white-text'>{displayDate}</p>
            <p className='white-text'>Max: {day.max}°C</p>
            <p className='white-text'>Min: {day.min}°C</p>
            <p className='white-text'>Condition: {day.weather[0].main}</p>
          </div>
        );
      }) : (
        <p className='white-text'>No forecast data available. Please search for a location!</p>
      )}
    </div>
  );
}