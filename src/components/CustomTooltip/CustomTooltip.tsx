import { METRICS } from "../../constants";
import { MetricType, CityMetricData } from "../../types";

export interface TooltipEntry {
  name: string;
  value: number;
  payload: {
    date: string;
    [cityName: string]: CityMetricData | string;
  };
  color: string;
}

interface CustomTooltipProps {
  active: boolean;
  payload: TooltipEntry[];
  label: string;
  metricType: MetricType;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  metricType,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const metric = METRICS.find((m) => m.key === metricType) || METRICS[0];

    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-4 rounded-lg shadow-lg min-w-[200px]">
        <p className="font-semibold mb-2 pb-2 border-b border-gray-200">
          {label}
        </p>
        {payload.map((entry) => {
          const cityData = entry.payload[entry.name] as CityMetricData;
          return (
            <div key={entry.name} className="mb-3">
              <div
                className="flex items-center gap-2 mb-2 font-medium"
                style={{ color: entry.color }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
              <div className="ml-5 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{metric.label}:</span>
                  <span className="font-medium">
                    {cityData[metric.key]?.toFixed(2)} {metric.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
