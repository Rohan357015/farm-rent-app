import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTemperatureThreeQuarters ,faTemperatureArrowUp ,faSnowflake } from  '@fortawesome/free-solid-svg-icons'

function AutoWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c2ae6f5c39c0a78cc63d6435b768765&units=metric`
            )
              .then((res) => res.json())
              .then((data) => {
                setWeather(data);
                setLoading(false);
              })
              .catch((err) => {
                setError(err.message);
                setLoading(false);
              });
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation not supported");
        setLoading(false);
      }
    };

    fetchWeather();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) return <p className="p-4 text-gray-500">Loading weather...</p>;
  if (error) return <p className="p-4 text-red-500">⚠️ Location Error: {error}</p>;
  if (!weather) return <p className="p-4 text-gray-500">Unable to load weather</p>;

  return (
    <div className="p-4 rounded-lg flex flex-col gap-5 justify-center items-center text-blue-950">
      <h2 className="text-xl font-semibold">🌤 {weather.name}</h2>
      <div className="flex gap-8 justify-center items-center text-[1rem]">
      <div>
      <p className="text-[1.1rem]"><FontAwesomeIcon icon={faTemperatureThreeQuarters} /><span className="font-bold">{weather.main.temp}°C</span></p>
      </div>
      <div>
       <p className="text-[1.1rem]"><FontAwesomeIcon icon={faTemperatureArrowUp} /><span className="font-bold">{weather.weather[0].main}</span></p>
      </div>
        <div>
      <p className="text-[1.1rem] font-bold "><FontAwesomeIcon icon={faSnowflake} /><span className="font-bold">{weather.main.humidity}% </span></p>
      </div>
      </div>
    </div>
  );
}

export default AutoWeather;