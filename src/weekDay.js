import React from 'react'

export default function weekDay({ weatherData }) {
  // Get the current date and format it
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', // "Monday"
    year: 'numeric', // "2021"
    month: 'long', // "July"
    day: 'numeric', // "19"
  });

  return (
    <div className="Today__Container">
      <div className="Today__Weather">
        <div className="Today__Weatherinner">
          {/* Display the formatted date */}
          <p className="white-text">{currentDate}</p>
          {weatherData ? (
            <>
              <p className="white-text">Temperature: {weatherData.main.temp}°C</p>
              <p className="white-text">Condition: {weatherData.weather[0].main}</p>
              {/* Display other data as needed */}
            </>
          ) : (
            <p className="white-text">No weather data available. Search for a location!</p>
          )}
        </div>
      </div>
    </div>
  );
}
