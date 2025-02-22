export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface CityWeather {
  city: string;
  data: WeatherData[];
  color: string;
}

export interface City {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export type MetricType = "temperature" | "pressure" | "humidity" | "wind";

export interface WeatherState {
  data: WeatherData[];
  city: City | null;
  loading: boolean;
  error: string | null;
}

export interface FormattedWeatherData {
  date: string;
  [cityName: string]:
    | {
        temperature: number;
        pressure: number;
        humidity: number;
        wind: number;
        [key: string]: number;
      }
    | string;
}

export interface CityMetricData {
  temperature: number;
  pressure: number;
  humidity: number;
  wind: number;
}

export interface ProcessedCityData {
  [date: string]: {
    [city: string]: CityMetricData;
  };
}

export enum Granularity {
  ThreeHours = "3h",
  Daily = "day",
}

export interface MetricInfo {
  key: MetricType;
  label: string;
  unit: string;
}
