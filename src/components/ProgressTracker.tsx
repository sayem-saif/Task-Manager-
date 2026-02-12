import { useMemo } from "react";
import { Task } from "@/types/task";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface ProgressTrackerProps {
  tasks: Task[];
}

const ProgressTracker = ({ tasks }: ProgressTrackerProps) => {
  const { chartData, completionRate, trend } = useMemo(() => {
    const now = new Date();
    const days: { date: string; label: string; completed: number; added: number; total: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });

      const completedOnDay = tasks.filter(
        (t) => t.completed && t.completedAt === dateStr
      ).length;

      const dueOnDay = tasks.filter((t) => t.dueDate === dateStr).length;

      days.push({
        date: dateStr,
        label,
        completed: completedOnDay,
        added: dueOnDay,
        total: tasks.filter((t) => t.dueDate <= dateStr && t.completed && (t.completedAt || "") <= dateStr).length,
      });
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recent = days.slice(-3);
    const completedRecent = recent.reduce((s, d) => s + d.completed, 0);
    const earlier = days.slice(0, 3);
    const completedEarlier = earlier.reduce((s, d) => s + d.completed, 0);

    let trendDir: "up" | "down" | "stable" = "stable";
    if (completedRecent > completedEarlier) trendDir = "up";
    else if (completedRecent < completedEarlier) trendDir = "down";

    return { chartData: days, completionRate: rate, trend: trendDir };
  }, [tasks]);

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 shadow-card animate-slide-up">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Progress Tracker</h3>
            <p className="text-[11px] text-muted-foreground">Last 7 days activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Completion rate */}
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2">
            <span className="text-[11px] font-medium text-primary">Completion</span>
            <span className="text-base font-bold text-primary">{completionRate}%</span>
          </div>
          {/* Trend */}
          <div className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold ${
            trend === "up"
              ? "bg-priority-low-bg text-priority-low"
              : trend === "down"
              ? "bg-priority-high-bg text-priority-high"
              : "bg-secondary text-muted-foreground"
          }`}>
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
            {trend === "stable" && <Minus className="h-3.5 w-3.5" />}
            {trend === "up" ? "Going up" : trend === "down" ? "Slowing" : "Steady"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-700 ease-out"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* Chart */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--priority-medium))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--priority-medium))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#colorCompleted)"
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
            />
            <Area
              type="monotone"
              dataKey="added"
              name="Due"
              stroke="hsl(var(--priority-medium))"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorDue)"
              dot={{ r: 3, fill: "hsl(var(--priority-medium))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressTracker;
