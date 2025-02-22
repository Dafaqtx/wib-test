import React from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
} as const;

const Spinner: React.FC<Props> = ({ size = "md", className = "" }) => {
  return (
    <div
      role="status"
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Spinner;
