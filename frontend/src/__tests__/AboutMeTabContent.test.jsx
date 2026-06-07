import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import getProfile from "../services/getProfile";
import AboutMeTabContent from "../AboutMeTabContent/AboutMeTabContent";

vi.mock("../services/getProfile");
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ headers: {} }),
  AuthProvider: ({ children }) => children,
}));

const renderWithRoute = (username) => {
  return render(
    <MemoryRouter initialEntries={[`/profile/${username}`]}>
      <Routes>
        <Route path="/profile/:username" element={<AboutMeTabContent />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("AboutMeTabContent", () => {
  it("renders loading state initially", () => {
    getProfile.mockReturnValue(new Promise(() => {}));
    renderWithRoute("testuser");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user info when profile is loaded", async () => {
    const mockProfile = {
      username: "testuser",
      bio: "Hello, I am a test user.",
      image: "https://example.com/avatar.png",
    };
    getProfile.mockResolvedValue(mockProfile);
    renderWithRoute("testuser");

    expect(await screen.findByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Hello, I am a test user.")).toBeInTheDocument();
    expect(screen.getByAltText("testuser")).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("renders 'User not found.' when profile is null", async () => {
    getProfile.mockResolvedValue(null);
    renderWithRoute("nonexistent");
    expect(await screen.findByText("User not found.")).toBeInTheDocument();
  });
});