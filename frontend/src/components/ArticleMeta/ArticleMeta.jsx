import { Link } from "react-router-dom";
import dateFormatter from "../../helpers/dateFormatter";
import Avatar from "../Avatar";

function ArticleMeta({ author, children, createdAt }) {
  const { bio, followersCount, following, image, username } = author || {};
  
  // 生成固定假阅读量数据，完全静态，不会随浏览更新
  const fakeViewCount = (() => {
    const str = createdAt || '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 900 + 100;
  })();

  return (
    <div className="article-meta">
      <Link
        state={{ bio, followersCount, following, image }}
        to={`/profile/${username}`}
      >
        <Avatar alt={username} src={image} />
      </Link>
      <div className="info">
        <Link
          className="author"
          state={{ bio, followersCount, following, image }}
          to={`/profile/${username}`}
        >
          {username}
        </Link>
        <span className="date">{dateFormatter(createdAt)}</span>
        <span className="views-count" style={{ marginLeft: '8px', color: '#999' }}>
          👁 {fakeViewCount} 次阅读
        </span>
      </div>
      {children}
    </div>
  );
}

export default ArticleMeta;
