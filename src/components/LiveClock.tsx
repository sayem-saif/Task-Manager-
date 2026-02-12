import { useLiveClock } from "@/hooks/useRealTime";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const now = useLiveClock();

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-secondary/60 px-3.5 py-2 backdrop-blur-sm">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
        <Clock className="h-3 w-3 text-primary" />
      </div>
      <span className="text-xs font-semibold text-foreground tabular-nums">{time}</span>
      <div className="h-3 w-px bg-border" />
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
};

export default LiveClock;
