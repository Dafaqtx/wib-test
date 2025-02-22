import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WeatherChart from "../WeatherChart/WeatherChart";
import { CityWeather, Granularity } from "../../types";

// Mock recharts components
vi.mock("recharts", () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="chart-line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe("WeatherChart", () => {
  const mockCities: CityWeather[] = [
    {
      city: "London",
      color: "#8884d8",
      data: [
        {
          dt: 1709136000,
          main: {
            temp: 20,
            feels_like: 19,
            pressure: 1013,
            humidity: 80,
          },
          wind: { speed: 5 },
          weather: [{ description: "clear sky", icon: "01d" }],
        },
      ],
    },
  ];

  it("renders chart components", () => {
    render(
      <WeatherChart
        cities={mockCities}
        metricType="temperature"
        granularity={Granularity.Daily}
      />
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
    expect(screen.getByTestId("chart-line")).toBeInTheDocument();
  });

  it("renders correct number of lines", () => {
    const multipleCities = [
      ...mockCities,
      { ...mockCities[0], city: "Paris", color: "#82ca9d" },
    ];

    render(
      <WeatherChart
        cities={multipleCities}
        metricType="temperature"
        granularity={Granularity.Daily}
      />
    );

    const lines = screen.getAllByTestId("chart-line");
    expect(lines).toHaveLength(multipleCities.length);
  });
});
