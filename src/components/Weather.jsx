import React, { useEffect, useRef, useState } from "react"; // Import React and necessary hooks
import "./Weather.css"; // Import CSS for styling
import search_icon from "../assets/search.png"; // Import assets for icons
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef(); // Reference to the input field for city search

  const [weatherData, setWeatherData] = useState(null); // State to hold weather data

  // Object mapping weather condition codes to corresponding icons
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // Function to fetch weather data based on the provided city
  const search = async (city) => {
    if (city === "") {
      // Alert if no city is entered
      alert("Please enter city name");
      return;
    }

    try {
      // Construct the API URL using the city name and API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url); // Fetch data from the weather API
      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // Handle error responses (e.g., invalid city name)
        alert(data.message);
        return;
      }

      console.log(data); // Log data for debugging

      const icon = allIcons[data.weather[0].icon] || clear_icon; // Get the appropriate icon for the weather condition

      // Update state with the fetched weather data
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      // Handle network or other errors
      setWeatherData(false); // Reset state in case of error
      console.error("Error fetching weather data:", error);
    }
  };

  // UseEffect to fetch default weather data for "New York" on component load
  useEffect(() => {
    search("New York");
  }, []);

  return (
    <div className="weather">
      {/* Search bar with input field and search icon */}
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)} // Trigger search on click
        />
      </div>

      {/* Conditional rendering to show weather data or a loading message */}
      {weatherData ? (
        <>
          {/* Display weather icon */}
          <img src={weatherData.icon} alt="Weather icon" className="weather-icon" />
          {/* Display temperature and location */}
          <p className="temperature">{weatherData.temperature}℃</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            {/* Humidity data */}
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            {/* Wind speed data */}
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p> // Display while data is being fetched
      )}
    </div>
  );
};

export default Weather;
