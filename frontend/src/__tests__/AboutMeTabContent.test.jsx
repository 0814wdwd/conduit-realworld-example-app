import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AboutMeTabContent from '../AboutMeTabContent';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn().mockReturnValue({ username: 'testuser' })
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({ headers: { Authorization: 'Bearer test123' } })
}));

vi.mock('../../services/getProfile', () => ({
  default: vi.fn()
}));

vi.mock('../../components/Avatar/Avatar', () => ({
  default: ({ src, alt, className }) => <img data-testid="profile-avatar" src={src} alt={alt} className={className} />
}));

describe('AboutMeTabContent', () => {
  it('displays loading text before profile data is fetched', () => {
    render(<AboutMeTabContent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders profile username and avatar after data loads', async () => {
    const mockGetProfile = (await import('../../services/getProfile')).default;
    mockGetProfile.mockResolvedValue({
      username: 'alice_walker',
      image: 'https://example.com/avatar-alice.jpg',
      bio: ''
    });

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('alice_walker');
    });

    const avatar = screen.getByTestId('profile-avatar');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar-alice.jpg');
    expect(avatar).toHaveAttribute('alt', 'alice_walker');
    expect(avatar).toHaveClass('user-img');
  });

  it('renders user bio content when bio field exists', async () => {
    const mockGetProfile = (await import('../../services/getProfile')).default;
    mockGetProfile.mockResolvedValue({
      username: 'bob_martin',
      image: '',
      bio: 'Full stack developer, open source enthusiast.'
    });

    render(<AboutMeTabContent />);

    await waitFor(() => {
      expect(screen.getByText('Full stack developer, open source enthusiast.')).toBeInTheDocument();
    });
  });
});