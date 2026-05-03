import { render, screen } from "@testing-library/react";

import App from "./App";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => children,
  Navigate: () => null,
  Route: () => null,
  Routes: ({ children }) => children,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/login" }),
  Link: ({ children }) => children,
}));

test("renders the login experience", () => {
  render(<App />);
  expect(screen.getByText(/welcome back/i)).toBeTruthy();
});
