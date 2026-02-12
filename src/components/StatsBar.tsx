import { CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";

interface StatsBarProps {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

const StatsBar = ({ total, pending, completed, overdue }: StatsBarProps) => {
  const stats = [
    { label: "Total Tasks", value: total, icon: ListTodo, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Pending", value: pending, icon: Clock, iconBg: "bg-priority-medium-bg", iconColor: "text-priority-medium" },
    { label: "Completed", value: completed, icon: CheckCircle2, iconBg: "bg-priority-low-bg", iconColor: "text-priority-low" },
    { label: "Overdue", value: overdue, icon: AlertTriangle, iconBg: "bg-destructive/10", iconColor: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-slide-up">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="group relative overflow-hidden rounded-2xl glass p-4 shadow-card transition-all hover:shadow-md hover:scale-[1.02]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg} transition-transform group-hover:scale-110`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
