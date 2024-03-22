import React, { useState, useEffect } from 'react';
import './astronomyModule.css';
// Import planet images
import mercuryImage from './mercury.png';
import venusImage from './venus.png';
import marsImage from './mars.png';
import jupiterImage from './jupiter.png';
import saturnImage from './saturn.png';
import uranusImage from './uranus.png';
import neptuneImage from './neptune.png';
import earthImage from './earth.png';
import sunImage from './sun.png';
import moonImage from './moon.png';
import plutoImage from './pluto.png';

const AstronomyModule = ({ lat, lon }) => {
  const [tableData, setTableData] = useState([]);
  const [mostVisiblePlanet, setMostVisiblePlanet] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateOptions, setDateOptions] = useState([]);
  const [userTime, setUserTime] = useState('13:46:03');

  useEffect(() => {
    // Adjust to use current date and 5 days after
    const today = new Date();
    const fiveDaysLater = new Date(today);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    const generateDateOptions = (start, end) => {
      const dates = [];
      while (start <= end) {
        dates.push(start.toISOString().split('T')[0]);
        start.setDate(start.getDate() + 1);
      }
      setDateOptions(dates);
      setSelectedDate(dates[0]);
    };

    generateDateOptions(new Date(), fiveDaysLater);
  }, []);

  useEffect(() => {
    if (!selectedDate || !lat || !lon) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.astronomyapi.com/api/v2/bodies/positions?longitude=${lon}&latitude=${lat}&elevation=1&from_date=${selectedDate}&to_date=${selectedDate}&time=${encodeURIComponent(userTime)}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic YjY0MjIwNDgtN2QwMy00ZjVkLWJlNjgtMDU1ZjY0ODkzMWVjOmE5YThiZTQ4OGI0N2M0ZmE1OTJlM2ExOTIxYzZiNWZmMjBmNzM0Y2FhZjY3YTE2ODkyOWMxZmE0YTYzNWEwYmM5Njc2OWEwYTg1OTk5MTQwY2NhMzU2MGI1MzI1MTc1NDBiOTc4MTBiY2NjNzk1NGM1NTFjNjI1MDZiY2M5NjM5Y2FjZDQ2Nzc0NWQ1NTdiODkxOTA4NjUyZDBiNzNiOGJmMjM1ZmY3OTNlMzljZjFmYTIzN2E1MzBhMzNjZjVkNzkxMDAzYWI5MzNhOTI4NGQzZTIzMTU4MmUxNGE3ODgx',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch astronomy data');
        const data = await response.json();
        setTableData(data.data.table.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDate, userTime, lat, lon]);

  const planetImages = {
    Mercury: mercuryImage,
    Venus: venusImage,
    Mars: marsImage,
    Jupiter: jupiterImage,
    Saturn: saturnImage,
    Uranus: uranusImage,
    Neptune: neptuneImage,
    Earth: earthImage,
    Sun: sunImage,
    Moon: moonImage,
    Pluto: plutoImage,
  };


  useEffect(() => {
    // This effect could likely be merged with the first one to optimize performance
    if (tableData.length > 0) {
      const mostVisible = tableData.reduce((prev, current) => {
        const currentAltitude = current.cells[0].position.horizontal.altitude.degrees;
        if (currentAltitude > prev.maxAltitude) {
          return { name: current.cells[0].name, maxAltitude: currentAltitude };
        }
        return prev;
      }, { name: '', maxAltitude: -Infinity });

      setMostVisiblePlanet(mostVisible.name);
    }
  }, [tableData]);

  return (
    <div className='planet_Container'>
      <h2>Planetary Positions</h2>
      <input 
        type="time" 
        value={userTime} 
        onChange={(e) => setUserTime(e.target.value)}
        style={{ marginBottom: '10px' }} // Adding some space below the input for better layout
      />
      <div>
        {dateOptions.map(date => (
          <label key={date} style={{ marginRight: "10px" }}>
            <input
              type="radio"
              name="date"
              value={date}
              checked={selectedDate === date}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {date}
          </label>
        ))}
      </div>
      {mostVisiblePlanet && (
        <p className='mostVisible'>Most Visible Planet: {mostVisiblePlanet}</p>
      )}
      <table>
        <thead>
          <tr>
            <th>Object</th>
            <th>Distance (AU)</th>
            <th>Altitude (Degrees)</th>
            <th>Azimuth (Degrees)</th>
            <th>Picture</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData, index) => (
            <tr key={index}>
              <td>{rowData.cells[0].name}</td>
              <td>{rowData.cells[0].distance.fromEarth.au}</td>
              <td>{rowData.cells[0].position.horizontal.altitude.degrees}</td>
              <td>{rowData.cells[0].position.horizontal.azimuth.degrees}</td>
              <td>
                {planetImages[rowData.cells[0].name] && (
                  <img src={planetImages[rowData.cells[0].name]} alt={rowData.cells[0].name} width="100" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AstronomyModule;