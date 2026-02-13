import { Trash2, Pencil, Calendar, AlertTriangle, Timer, Clock } from "lucide-react";
import { Task } from "@/types/task";
import { useCountdown } from "@/hooks/useRealTime";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityConfig: Record<string, { badge: string; dot: string; accent: string; glow: string }> = {
  Low: {
    badge: "bg-priority-low-bg text-priority-low",
    dot: "bg-priority-low",
    accent: "border-l-priority-low",
    glow: "group-hover:shadow-[0_0_15px_-5px_hsl(160_70%_42%/0.3)]",
  },
  Medium: {
    badge: "bg-priority-medium-bg text-priority-medium",
    dot: "bg-priority-medium",
    accent: "border-l-priority-medium",
    glow: "group-hover:shadow-[0_0_15px_-5px_hsl(38_95%_50%/0.3)]",
  },
  High: {
    badge: "bg-priority-high-bg text-priority-high",
    dot: "bg-priority-high",
    accent: "border-l-priority-high",
    glow: "group-hover:shadow-[0_0_15px_-5px_hsl(0_80%_55%/0.3)]",
  },
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const dueDatetime = task.completed ? "" : (task.dueDate ? `${task.dueDate}|${task.dueTime || ""}` : "");
  const { timeLeft, isOverdue } = useCountdown(dueDatetime);
  const config = priorityConfig[task.priority];

  return (
    <div
      className={`group relative rounded-2xl border-l-4 p-4 sm:p-5 transition-all duration-200 ${config.accent} ${config.glow} ${
        isOverdue && !task.completed
          ? "border border-l-4 border-overdue-border bg-overdue-bg animate-pulse-subtle"
          : "glass shadow-card hover:shadow-md"
      } ${task.completed ? "opacity-55" : "hover:scale-[1.01]"}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          disabled={isOverdue && !task.completed}
          title={isOverdue && !task.completed ? "Cannot complete overdue tasks - delete to maintain on-time completion record" : ""}
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
            task.completed
              ? "border-primary gradient-primary shadow-sm"
              : isOverdue && !task.completed
              ? "border-destructive/30 bg-destructive/5 opacity-40 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary hover:scale-110 hover:shadow-sm"
          }`}
        >
          {task.completed && (
            <svg className="h-3.5 w-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-bold leading-snug tracking-tight ${
                task.completed ? "text-completed-text line-through" : "text-foreground"
              }`}
            >
              {task.title}
            </h3>
            <div className="flex flex-shrink-0 gap-0.5 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <button
                onClick={() => onEdit(task)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all hover:scale-110"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-110"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`mt-1.5 text-xs leading-relaxed ${task.completed ? "text-completed-text" : "text-muted-foreground"}`}>
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* OVERDUE badge - prominent */}
            {isOverdue && !task.completed && (
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                OVERDUE
              </span>
            )}

            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
              {task.priority}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] ${
                isOverdue && !task.completed
                  ? "bg-destructive/10 font-semibold text-destructive"
                  : "bg-secondary/60 text-muted-foreground"
              }`}>
                {isOverdue && !task.completed && <AlertTriangle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {/* Time */}
            {task.dueTime && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/60 px-2 py-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(task.dueTime)}
              </span>
            )}

            {/* Countdown */}
            {timeLeft && !task.completed && (
              <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${
                isOverdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              }`}>
                <Timer className="h-3 w-3" />
                {timeLeft}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
