import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { CHART_DIMENSIONS, CHART_TYPES, DECIMAL_PLACES } from "../../constants";
import { MetricType, CityWeather, Granularity } from "../../types";
import { getMetricLabel } from "../../utils";
import { useChartData } from "../../hooks";

import CustomTooltip, { TooltipEntry } from "../CustomTooltip/CustomTooltip";

interface Props {
  cities: CityWeather[];
  metricType: MetricType;
  granularity: Granularity;
}

const WeatherChart: React.FC<Props> = ({ cities, metricType, granularity }) => {
  const chartData = useChartData(cities, metricType, granularity);

  return (
    <div className="w-full" style={{ height: CHART_DIMENSIONS.HEIGHT }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray={CHART_DIMENSIONS.GRID_DASH_ARRAY} />
          <XAxis
            dataKey="date"
            angle={CHART_DIMENSIONS.X_AXIS_ANGLE}
            textAnchor="end"
            height={CHART_DIMENSIONS.X_AXIS_HEIGHT}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: getMetricLabel(metricType),
              angle: CHART_DIMENSIONS.Y_AXIS_ANGLE,
              position: "insideLeft",
            }}
            tickFormatter={(value) => value.toFixed(DECIMAL_PLACES)}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active ?? false}
                payload={payload as TooltipEntry[]}
                label={label}
                metricType={metricType}
              />
            )}
          />
          <Legend />
          {cities.map((city) => (
            <Line
              key={city.city}
              type={
                granularity === Granularity.Daily
                  ? CHART_TYPES.DAILY
                  : CHART_TYPES.HOURLY
              }
              dataKey={`${city.city}.${metricType}`}
              name={city.city}
              stroke={city.color}
              activeDot={{ r: CHART_DIMENSIONS.ACTIVE_DOT_RADIUS }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
