import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getProfile from "../../services/getProfile";
import Avatar from "../Avatar/Avatar";

function AboutMeTabContent() {
  const { username } = useParams();
  const { headers } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    getProfile({ headers, username })
      .then((result) => {
        setProfile(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [username, headers]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                User not found.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { bio, image, username: profileUsername } = profile;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Avatar
                alt={profileUsername}
                className="user-img"
                src={image}
              />
              <h4>{profileUsername}</h4>
              {bio && <p>{bio}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMeTabContent;
