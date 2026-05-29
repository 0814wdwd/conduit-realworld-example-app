import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toggleReactions from "../../services/toggleReactions";

const EMOJI_LIST = ["👍", "❤️", "🎉", "😆"];

function ReactionsBar({ slug, initialReactions, initialViewerReactions }) {
  const [reactions, setReactions] = useState(initialReactions);
  const [viewerReactions, setViewerReactions] = useState(initialViewerReactions);
  const [loading, setLoading] = useState(false);
  const { isAuth, headers } = useAuth();

  const handleReactionClick = async (emoji) => {
    if (!isAuth) {
      alert("请先登录");
      return;
    }

    setLoading(true);
    try {
      const result = await toggleReactions({ slug, emoji, headers });
      setReactions(result.reactions);
      setViewerReactions(result.viewerReactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 mt-3 mb-3">
      {EMOJI_LIST.map((emoji) => {
        const count = reactions?.[emoji] || 0;
        const isActive = viewerReactions.includes(emoji);
        return (
          <button
            key={emoji}
            className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline-secondary"}`}
            disabled={loading}
            onClick={() => handleReactionClick(emoji)}
          >
            {emoji} <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ReactionsBar;
