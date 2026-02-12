import { useState, useEffect, useCallback } from "react";

export const useLiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

export const useCountdown = (dueDatetime: string) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!dueDatetime) {
      setTimeLeft("");
      setIsOverdue(false);
      return;
    }

    const calc = () => {
      let due: Date;
      if (dueDatetime.includes("|")) {
        const [date, time] = dueDatetime.split("|");
        if (!date) { setTimeLeft(""); return; }
        due = time ? new Date(`${date}T${time}:00`) : new Date(`${date}T23:59:59`);
      } else {
        due = new Date(dueDatetime + "T23:59:59");
      }

      const now = new Date();
      const diff = due.getTime() - now.getTime();

      if (diff <= 0) {
        setIsOverdue(true);
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / 86400000);
        const hours = Math.floor((absDiff % 86400000) / 3600000);
        const mins = Math.floor((absDiff % 3600000) / 60000);
        if (days > 0) setTimeLeft(`${days}d ${hours}h overdue`);
        else if (hours > 0) setTimeLeft(`${hours}h ${mins}m overdue`);
        else setTimeLeft(`${mins}m overdue`);
      } else {
        setIsOverdue(false);
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        if (days > 0) setTimeLeft(`${days}d ${hours}h left`);
        else if (hours > 0) setTimeLeft(`${hours}h ${mins}m left`);
        else setTimeLeft(`${mins}m left`);
      }
    };

    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, [dueDatetime]);

  return { timeLeft, isOverdue };
};

export const useTaskNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm;
    }
    return "denied" as NotificationPermission;
  }, []);

  const notify = useCallback(
    (title: string, body: string) => {
      if (permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      }
    },
    [permission]
  );

  return { permission, requestPermission, notify };
};
