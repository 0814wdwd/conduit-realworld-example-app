import { useFeedContext } from "../../context/FeedContext";

function TagButton({ tagsList }) {
  const { changeTab } = useFeedContext();

  const handleClick = (e) => {
    changeTab(e, "tag");
  };

  return tagsList.slice(0, 5).map((name, index) => (
    <button
      className={`tag-pill tag-default${index < 5 ? " tag-hot" : ""}`}
      key={name}
      onClick={handleClick}
    >
      {index < 5 && <span className="tag-hot-badge" aria-label="热门标签">🔥</span>}
      {name}
    </button>
  ));
}

export default TagButton;