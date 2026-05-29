import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AboutMeTabContent from "../components/Profile/AboutMeTabContent";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getProfile from "../services/getProfile";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn()
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn()
}));

vi.mock("../services/getProfile", () => vi.fn());

vi.mock("../components/Avatar/Avatar", () => ({
  default: ({ src, alt, className }) => (
    <img data-testid="profile-avatar" src={src} alt={alt} className={className} />
  )
}));

describe("AboutMeTabContent", () => {
  it("renders loading state before profile data is fetched", () => {
    useParams.mockReturnValue({ username: "loading_user" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockImplementation(() => new Promise(() => {}));

    render(<AboutMeTabContent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("correctly renders username, avatar and non-empty bio after profile loads", async () => {
    const mockProfile = {
      username: "alice_dev",
      image: "https://example.com/alice-avatar.png",
      bio: "Full stack developer and open source enthusiast"
    };
    useParams.mockReturnValue({ username: "alice_dev" });
    useAuth.mockReturnValue({ headers: { Authorization: "Bearer test123" } });
    getProfile.mockResolvedValue(mockProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("alice_dev");
    });

    const avatar = screen.getByTestId("profile-avatar");
    expect(avatar).toHaveAttribute("src", "https://example.com/alice-avatar.png");
    expect(avatar).toHaveAttribute("alt", "alice_dev");
    expect(screen.getByText("Full stack developer and open source enthusiast")).toBeInTheDocument();
  });

  it("hides bio paragraph when profile bio is empty", async () => {
    const mockProfile = {
      username: "bob_new",
      image: "https://example.com/default-avatar.png",
      bio: ""
    };
    useParams.mockReturnValue({ username: "bob_new" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockResolvedValue(mockProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("bob_new");
    });

    expect(screen.queryByText(/Full stack/)).not.toBeInTheDocument();
  });
});