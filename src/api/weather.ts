import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const getCoordinates = async (city: string) => {
  const response = await axios.get(
    `${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`
  );
  return response.data[0];
};

export const getWeatherForecast = async (lat: number, lon: number) => {
  const response = await axios.get(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};
