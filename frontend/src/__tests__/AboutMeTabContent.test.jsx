import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AboutMeTabContent from "./AboutMeTabContent";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getProfile from "../services/getProfile";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn()
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

vi.mock("../services/getProfile", () => ({
  default: vi.fn()
}));

vi.mock("../../components/Avatar/Avatar", () => ({
  default: ({ src, alt }) => <img data-testid="user-avatar" src={src} alt={alt} />
}));

describe("AboutMeTabContent", () => {
  it("renders loading state before profile is fetched", () => {
    useParams.mockReturnValue({ username: "loadinguser" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockImplementation(() => new Promise(() => {}));

    render(<AboutMeTabContent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders username and avatar correctly after profile loads", async () => {
    const testProfile = {
      username: "alice_smith",
      image: "https://example.com/alice-avatar.png",
      bio: null
    };
    useParams.mockReturnValue({ username: "alice_smith" });
    useAuth.mockReturnValue({ headers: { Authorization: "Bearer test123" } });
    getProfile.mockResolvedValue(testProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("alice_smith");
    });
    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toHaveAttribute("alt", "alice_smith");
    expect(avatar).toHaveAttribute("src", "https://example.com/alice-avatar.png");
  });

  it("renders bio content when profile has non-empty bio", async () => {
    const testBio = "Full stack developer, open source enthusiast";
    const testProfile = {
      username: "bob_dev",
      image: "https://example.com/bob-avatar.jpg",
      bio: testBio
    };
    useParams.mockReturnValue({ username: "bob_dev" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockResolvedValue(testProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByText(testBio)).toBeInTheDocument();
    });
  });
});