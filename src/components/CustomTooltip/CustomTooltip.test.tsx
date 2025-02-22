import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CustomTooltip from "./CustomTooltip";

describe("CustomTooltip", () => {
  const mockPayload = [
    {
      name: "London",
      value: 20,
      payload: {
        date: "2024-02-28",
        London: {
          temperature: 20,
          pressure: 1013,
          humidity: 80,
          wind: 5,
        },
      },
      color: "#8884d8",
    },
  ];

  it("renders nothing when not active", () => {
    const { container } = render(
      <CustomTooltip
        active={false}
        payload={[]}
        label=""
        metricType="temperature"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders tooltip content when active", () => {
    render(
      <CustomTooltip
        active={true}
        payload={mockPayload}
        label="2024-02-28"
        metricType="temperature"
      />
    );

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("20.00 °C")).toBeInTheDocument();
  });

  it("displays correct metric unit", () => {
    const metrics = [
      { type: "temperature" as const, value: "20.00 °C" },
      { type: "pressure" as const, value: "1013.00 hPa" },
      { type: "humidity" as const, value: "80.00 %" },
      { type: "wind" as const, value: "5.00 m/s" },
    ];

    metrics.forEach(({ type, value }) => {
      render(
        <CustomTooltip
          active={true}
          payload={mockPayload}
          label="2024-02-28"
          metricType={type}
        />
      );
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});
