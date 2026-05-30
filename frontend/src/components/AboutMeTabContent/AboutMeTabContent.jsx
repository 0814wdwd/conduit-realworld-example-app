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
    if (!username) return;
    getProfile({ headers, username }).then(setProfile);
  }, [username, headers]);

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Avatar src={profile.image} alt={profile.username} className="user-img" />
              <h4>{profile.username}</h4>
              {profile.bio && <p>{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMeTabContent;
