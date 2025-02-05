import { useState, useEffect } from "react";
import { socket } from "../../utils/socket"

export const useUnreadMessages = (userId: string) => {
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    // Request initial unread counts
    socket.emit("get_unread_count", { userId });

    // Listen for updates to unread counts
    const handleUnreadUpdate = (
      counts: Array<{ _id: string; count: number }>
    ) => {
      const countsMap = counts.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {} as { [key: string]: number });
      setUnreadCounts(countsMap);
    };

    socket.on("unread_count_update", handleUnreadUpdate);

    // Clean up
    return () => {
      socket.off("unread_count_update", handleUnreadUpdate);
    };
  }, [userId]);

  return unreadCounts;
};
