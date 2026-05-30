import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AboutMeTabContent from "../AboutMeTabContent";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../../services/getProfile", () => vi.fn());
vi.mock("../../components/Avatar/Avatar", () => ({
  default: vi.fn(({ src, alt }) => <img data-testid="user-avatar" src={src} alt={alt} className="user-img" />),
}));

describe("AboutMeTabContent", () => {
  it("renders loading state before profile data is fetched", async () => {
    const { useParams } = await import("react-router-dom");
    const { useAuth } = await import("../../context/AuthContext");
    const getProfile = (await import("../../services/getProfile")).default;

    useParams.mockReturnValue({ username: "loading_user" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockImplementation(() => new Promise(() => {}));

    render(<AboutMeTabContent />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("correctly renders username and bio after profile loads", async () => {
    const mockProfile = {
      username: "conduit_user",
      bio: "I love writing articles about fullstack development",
      image: "https://example.com/default-avatar.jpg",
    };
    const { useParams } = await import("react-router-dom");
    const { useAuth } = await import("../../context/AuthContext");
    const getProfile = (await import("../../services/getProfile")).default;

    useParams.mockReturnValue({ username: "conduit_user" });
    useAuth.mockReturnValue({ headers: { Authorization: "Bearer test123" } });
    getProfile.mockResolvedValue(mockProfile);

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("conduit_user");
    });
    expect(screen.getByText("I love writing articles about fullstack development")).toBeInTheDocument();
  });

  it("passes correct image and alt props to Avatar, hides bio when it is empty", async () => {
    const mockProfileNoBio = {
      username: "no_bio_user",
      bio: null,
      image: "https://example.com/custom-avatar.png",
    };
    const { useParams } = await import("react-router-dom");
    const { useAuth } = await import("../../context/AuthContext");
    const getProfile = (await import("../../services/getProfile")).default;

    useParams.mockReturnValue({ username: "no_bio_user" });
    useAuth.mockReturnValue({ headers: {} });
    getProfile.mockResolvedValue(mockProfileNoBio);

    render(<AboutMeTabContent />);

    const avatar = await screen.findByTestId("user-avatar");
    expect(avatar).toHaveAttribute("src", "https://example.com/custom-avatar.png");
    expect(avatar).toHaveAttribute("alt", "no_bio_user");
    expect(screen.queryByText(/bio/)).not.toBeInTheDocument();
  });
});