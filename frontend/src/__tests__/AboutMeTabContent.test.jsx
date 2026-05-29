import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AboutMeTabContent from "../AboutMeTabContent";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getProfile from "../services/getProfile";

vi.mock("react-router-dom");
vi.mock("../context/AuthContext");
vi.mock("../services/getProfile");
vi.mock("../../components/Avatar/Avatar", () => ({
  default: ({ src, alt, className }) => (
    <img data-testid="user-avatar" src={src} alt={alt} className={className} />
  ),
}));

describe("AboutMeTabContent", () => {
  const mockHeaders = { Authorization: "Bearer test-token" };
  const mockTestUsername = "demo_user";

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ username: mockTestUsername });
    useAuth.mockReturnValue({ headers: mockHeaders });
  });

  it("displays loading state before profile data is fetched", () => {
    getProfile.mockImplementation(() => new Promise(() => {}));
    render(<AboutMeTabContent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("correctly renders username, avatar image and bio after profile loads", async () => {
    const mockFullProfile = {
      username: mockTestUsername,
      image: "https://example.com/demo-avatar.png",
      bio: "This is my public profile bio"
    };
    getProfile.mockResolvedValue(mockFullProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(mockFullProfile.username);
    });

    const avatar = screen.getByTestId("user-avatar");
    expect(avatar).toHaveAttribute("src", mockFullProfile.image);
    expect(avatar).toHaveAttribute("alt", mockFullProfile.username);
    expect(screen.getByText(mockFullProfile.bio)).toBeInTheDocument();
  });

  it("does not render bio element when profile bio is empty or falsy", async () => {
    const mockNoBioProfile = {
      username: "nobio_user",
      image: "https://example.com/empty-bio-avatar.jpg",
      bio: ""
    };
    getProfile.mockResolvedValue(mockNoBioProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
    });

    expect(screen.queryByText(/public profile bio/i)).not.toBeInTheDocument();
  });
});