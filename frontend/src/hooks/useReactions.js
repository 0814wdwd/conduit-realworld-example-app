import { useState, useCallback } from "react";
import toggleReactions from "../services/toggleReactions";

function useReactions(slug, initialData = { hasReacted: false, reactionsCount: 0 }) {
  const [hasReacted, setHasReacted] = useState(initialData.hasReacted);
  const [reactionsCount, setReactionsCount] = useState(initialData.reactionsCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleReaction = useCallback(async () => {
    if (isLoading) return;

    // 保存旧状态用于回滚
    const previousHasReacted = hasReacted;
    const previousReactionsCount = reactionsCount;

    // 乐观更新
    const nextHasReacted = !previousHasReacted;
    setHasReacted(nextHasReacted);
    setReactionsCount(nextHasReacted ? previousReactionsCount + 1 : previousReactionsCount - 1);
    setIsLoading(true);
    setError(null);

    try {
      const updatedReactionData = await toggleReactions({
        slug,
        reacted: nextHasReacted,
      });

      // 服务端返回后同步最新状态
      setHasReacted(updatedReactionData.hasReacted);
      setReactionsCount(updatedReactionData.reactionsCount);
    } catch (err) {
      // 请求失败回滚状态
      setHasReacted(previousHasReacted);
      setReactionsCount(previousReactionsCount);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, hasReacted, reactionsCount, isLoading]);

  return {
    hasReacted,
    reactionsCount,
    toggleReaction,
    isLoading,
    error,
  };
}

export default useReactions;