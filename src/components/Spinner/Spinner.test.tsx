import { render, screen } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders with default size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-6 h-6"); // md size
  });

  it("renders with custom size", () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-8 h-8");
  });

  it("applies custom className", () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-class");
  });
});
