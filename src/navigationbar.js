import React, { useState } from 'react';
import './navigationbar.css';

export default function Navigationbar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  const fetchLatLong = async (location) => {
    const apiKey = '4c9d83613e1f814a6c1d1f57c346b997'; // Replace YOUR_API_KEY_HERE with your actual API key
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, name } = data[0]; // Assuming the first result is the desired one
        return { lat, lon, name };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Failed to fetch latitude and longitude:', error);
      return null; // Handle the error based on your app's needs
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const latLongData = await fetchLatLong(inputValue);
    if (latLongData) {
      onSearch(latLongData); // Send the lat and long data back to App.js
    }
    setInputValue(''); // Clear the input after search
  };

  return (
    <div className="search__container">
      <form onSubmit={handleSubmit}>
        <input
          className="search__input"
          type="text"
          placeholder="Search location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
    </div>
  );
}
