import React, { useState } from 'react';
import Navigationbar from './navigationbar';
import WeekModule from './weekModule';
import TodayModule from './todayModule';
import AstronomyModule from './astronomyModule';
import './App.css';

function App() {
  // Step 1: Create state variables to store latitude and longitude
  const [latLong, setLatLong] = useState({ lat: null, lon: null, name: null });
  //Define a callback function to update the state with lat and long
  const handleSearch = (data) => {
    setLatLong(data);
  };
  return (
    <>
      <Navigationbar onSearch={handleSearch} />
      <TodayModule lat={latLong.lat} lon={latLong.lon} name={latLong.name} />
      <WeekModule lat={latLong.lat} lon={latLong.lon} />
      <AstronomyModule></AstronomyModule>
    </>
  );
}

export default App;
