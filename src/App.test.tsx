import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import App from "./App";
import { getCoordinates, getWeatherForecast } from "./api/weather";

// Mock API calls
vi.mock("./api/weather", () => ({
  getCoordinates: vi.fn(),
  getWeatherForecast: vi.fn(),
}));

// Mock WeatherChart component
vi.mock("./components/WeatherChart/WeatherChart", () => ({
  default: () => <div data-testid="weather-chart">Weather Chart</div>,
}));

describe("App", () => {
  const mockWeatherData = {
    list: [
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial state correctly", () => {
    render(<App />);

    expect(screen.getByText("Weather Forecast")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter city name...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("handles city search successfully", async () => {
    const mockCoords = { lat: 51.5074, lon: -0.1278 };
    (getCoordinates as any).mockResolvedValue(mockCoords);
    (getWeatherForecast as any).mockResolvedValue(mockWeatherData);

    render(<App />);

    const input = screen.getByPlaceholderText("Enter city name...");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "London");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByTestId("weather-chart")).toBeInTheDocument();
    });
  });

  it("displays error message when city is not found", async () => {
    (getCoordinates as any).mockRejectedValue(new Error("City not found"));

    render(<App />);

    const input = screen.getByPlaceholderText("Enter city name...");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "NonExistentCity");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("City not found")).toBeInTheDocument();
    });
  });

  it("prevents adding duplicate cities", async () => {
    const mockCoords = { lat: 51.5074, lon: -0.1278 };
    (getCoordinates as any).mockResolvedValue(mockCoords);
    (getWeatherForecast as any).mockResolvedValue(mockWeatherData);

    render(<App />);

    const input = screen.getByPlaceholderText("Enter city name...");
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Add city first time
    await userEvent.type(input, "London");
    await userEvent.click(searchButton);

    // Try to add same city again
    await userEvent.type(input, "London");
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("City already added")).toBeInTheDocument();
    });
  });

  it("removes city when delete button is clicked", async () => {
    const mockCoords = { lat: 51.5074, lon: -0.1278 };
    (getCoordinates as any).mockResolvedValue(mockCoords);
    (getWeatherForecast as any).mockResolvedValue(mockWeatherData);

    render(<App />);

    // Add a city
    const input = screen.getByPlaceholderText("Enter city name...");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "London");
    await userEvent.click(searchButton);

    // Wait for city to appear and click delete
    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: "" });
      fireEvent.click(deleteButton);
    });

    // Verify city is removed
    await waitFor(() => {
      expect(screen.queryByText("London")).not.toBeInTheDocument();
    });
  });

  it("changes metric type correctly", async () => {
    const mockCoords = { lat: 51.5074, lon: -0.1278 };
    (getCoordinates as any).mockResolvedValue(mockCoords);
    (getWeatherForecast as any).mockResolvedValue(mockWeatherData);

    render(<App />);

    // Add a city first
    await userEvent.type(
      screen.getByPlaceholderText("Enter city name..."),
      "London"
    );
    await userEvent.click(screen.getByRole("button", { name: /search/i }));

    // Change metric type
    const metricSelect = screen.getByRole("combobox", { name: "Metric Type" });
    await userEvent.selectOptions(metricSelect, "pressure");

    expect(metricSelect).toHaveValue("pressure");
  });

  it("disables inputs during loading", async () => {
    (getCoordinates as any).mockImplementation(() => new Promise(() => {}));

    render(<App />);

    const input = screen.getByPlaceholderText("Enter city name...");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "London");
    fireEvent.click(searchButton);

    expect(input).toBeDisabled();
    expect(searchButton).toBeDisabled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
