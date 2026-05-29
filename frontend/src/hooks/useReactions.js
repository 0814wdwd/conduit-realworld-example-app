import { useState, useCallback } from "react";
import toggleReactions from "../services/toggleReactions";

function useReactions(slug, initialData) {
  const [reactionState, setReactionState] = useState({
    hasReacted: !!initialData?.hasReacted,
    reactionsCount: Number(initialData?.reactionsCount || 0),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleReaction = useCallback(async () => {
    if (isLoading) return;

    const prevState = reactionState;
    const nextState = {
      hasReacted: !prevState.hasReacted,
      reactionsCount: prevState.hasReacted
        ? prevState.reactionsCount - 1
        : prevState.reactionsCount + 1,
    };

    // 乐观更新
    setReactionState(nextState);
    setIsLoading(true);
    setError(null);

    try {
      const updatedReaction = await toggleReactions({
        slug,
        hasReacted: prevState.hasReacted,
      });
      // 同步服务端返回的最新状态
      if (updatedReaction) {
        setReactionState({
          hasReacted: updatedReaction.hasReacted,
          reactionsCount: updatedReaction.reactionsCount,
        });
      }
    } catch (err) {
      // 失败回滚
      setReactionState(prevState);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, isLoading, reactionState]);

  return {
    hasReacted: reactionState.hasReacted,
    reactionsCount: reactionState.reactionsCount,
    toggleReaction,
    isLoading,
    error,
  };
}

export default useReactions;