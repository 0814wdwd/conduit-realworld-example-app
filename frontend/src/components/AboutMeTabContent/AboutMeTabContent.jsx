import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getProfile from "../../services/getProfile";
import Avatar from "../../components/Avatar/Avatar";

function AboutMeTabContent() {
  const { username } = useParams();
  const { headers } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile({ headers, username });
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    fetchProfile();
  }, [username, headers]);

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {!profile ? (
                <p>Loading...</p>
              ) : (
                <>
                  <Avatar
                    src={profile.image}
                    alt={profile.username}
                    className="user-img"
                  />
                  <h4>{profile.username}</h4>
                  {profile.bio && <p>{profile.bio}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMeTabContent;
