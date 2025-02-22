import { MetricInfo, MetricType } from "../types";

export const CHART_DIMENSIONS = {
  WIDTH: "100%",
  HEIGHT: 400,
  ACTIVE_DOT_RADIUS: 8,
  GRID_DASH_ARRAY: "3 3",
  X_AXIS_ANGLE: -45,
  X_AXIS_HEIGHT: 70,
  Y_AXIS_ANGLE: -90,
} as const;

export const CHART_TYPES = {
  DAILY: "bump",
  HOURLY: "monotone",
} as const;

export const METRIC_LABELS: Record<MetricType, string> = {
  temperature: "Temperature (°C)",
  pressure: "Pressure (hPa)",
  humidity: "Humidity (%)",
  wind: "Wind Speed (m/s)",
} as const;

export const CITY_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#e91e63",
  "#673ab7",
  "#2196f3",
  "#009688",
] as const;

export const DECIMAL_PLACES = 2;

export const DATE_FORMATS = {
  HOURLY: {
    MONTH: "2-digit",
    DAY: "2-digit",
    HOUR: "2-digit",
    MINUTE: "2-digit",
  },
  DAILY: {
    MONTH: "2-digit",
    DAY: "2-digit",
  },
} as const;

export const METRICS: MetricInfo[] = [
  { key: "temperature", label: "Temperature", unit: "°C" },
  { key: "pressure", label: "Pressure", unit: "hPa" },
  { key: "humidity", label: "Humidity", unit: "%" },
  { key: "wind", label: "Wind Speed", unit: "m/s" },
];
