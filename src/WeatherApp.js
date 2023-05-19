import React, { useState} from 'react';
import axios from 'axios';
// import { TiWeatherSunny } from 'react-icons/ti';
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { HiEye } from 'react-icons/hi';
import { FaTemperatureHigh } from 'react-icons/fa';
import { IconContext } from "react-icons";
import Autosuggest from 'react-autosuggest';


const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = 'de92a59f8244223023724e014ef151d7';

  const handleInputChange = (event, { newValue }) => {
    setCity(newValue);
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      const filteredSuggestions = response.data.filter((item) => item.local_names);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      setSuggestions([]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setWeatherData(null);
      setError('Error retrieving weather data : Enter a valid Input');
    }

    setLoading(false);
  };
  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div className='fixed z-10 w-[182px] bg-[#eedcba] p-2'>{suggestion.name}</div>
  );

  return (
    <div className='grid place-items-center h-screen'>
    <div className="container mx-auto px-4 justify-items-center grid p-10 font-serif">
      <h1 className="font-bold mb-4 content-center text-5xl">Weather App</h1>
      <form onSubmit={handleSubmit} className="flex items-center justify-center mt-6">
          <Autosuggest
            inputProps={{
              placeholder: 'Enter city name',
              value: city,
              onChange: handleInputChange,
              className: 'p-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500',
            }}
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={handleSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            disabled={!city || loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {weatherData && (
        <div className="mt-4 grid justify-items-center">
        <div className='city grid justify-center rounded-2xl border border-black p-3 w-8/12 max-[500px]:w-full'>
          <h2 className="font-bold text-3xl">{weatherData.name}</h2>
        </div>
        
        <div className='grid grid-cols-3 max-[500px]:grid-cols-2'>
        {/* <div className='description flex'>
          <p>
            <TiWeatherSunny /> {weatherData.weather[0].description}
          </p>
        </div> */}
        <div className='temperature flex'>
          <p className='grid p-2 justify-items-center items-center rounded-2xl m-2.5 bg-yellow-400 w-28 h-32'>
          <IconContext.Provider value={{ className: "w-3/4 h-3/4" }}>
            <FaTemperatureHigh/></IconContext.Provider>
             <p>Temperature</p> <p>{weatherData.main.temp}°C</p> 
          </p>
        </div>
        <div className='flex'>
            <p className='grid p-2 justify-items-center items-center rounded-2xl m-2.5 bg-cyan-500 w-28 h-32'>
          <IconContext.Provider value={{ className: "w-3/4 h-3/4" }}>
            <WiHumidity /></IconContext.Provider>
             <p>Humidity </p>
             <p>{weatherData.main.humidity}%</p>  
          </p>
          </div>
          <div className='flex'>
          <p className='grid p-2 justify-items-center items-center rounded-2xl m-2.5 bg-teal-400 w-28 h-32'>
          <IconContext.Provider value={{ className: "w-3/4 h-3/4" }}>
            <WiStrongWind /></IconContext.Provider>
             <p>Wind Speed</p> 
             <p>{weatherData.wind.speed} m/s </p>
          </p>
          </div>
          <div className='flex'>
          <p className='grid p-2 justify-items-center items-center rounded-2xl m-2.5 bg-green-400 w-28 h-32'>
          <IconContext.Provider value={{ className: "w-3/4 h-3/4" }}>
            <WiBarometer /></IconContext.Provider>
             <p>Pressure</p>
             <p>{weatherData.main.pressure} hPa </p>
          </p>
          </div>
          <div className='flex'>
          <p className='grid p-2 justify-items-center items-center rounded-2xl m-2.5 bg-stone-400 w-28 h-32'>
          <IconContext.Provider value={{ className: "w-3/4 h-3/4" }}>
            <HiEye /></IconContext.Provider> 
             <p>Visibility</p>
             <p>{weatherData.visibility} m</p>
          </p>
          </div>
        </div>
        </div>
      )}
    
    </div>
    </div>
  );
};

export default WeatherApp;
