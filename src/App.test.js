import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders a playable game board", () => {
  render(<App />);
  expect(screen.getByText(/think three/i)).toBeInTheDocument();
  expect(
    screen.getByRole("grid", { name: /tic-tac-toe board/i }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("gridcell")).toHaveLength(9);
});

test("navbar switches between game components", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /memory match/i }));
  expect(screen.getByText(/keep your/i)).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /hidden card/i })).toHaveLength(
    12,
  );

  fireEvent.click(screen.getByRole("button", { name: /connect four/i }));
  expect(screen.getByText(/build a/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /drop in column 1/i }),
  ).toBeInTheDocument();
});
