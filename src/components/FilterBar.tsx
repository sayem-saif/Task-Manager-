import { ArrowUpDown, ListFilter } from "lucide-react";

export type FilterType = "all" | "pending" | "completed";
export type SortType = "dueDate" | "priority";

interface FilterBarProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
  taskCounts: { all: number; pending: number; completed: number };
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Done" },
];

const FilterBar = ({ filter, sort, onFilterChange, onSortChange, taskCounts }: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl glass p-3 shadow-card animate-slide-up">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <ListFilter className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex gap-1 rounded-xl bg-secondary/60 p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                filter === f.value
                  ? "gradient-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                filter === f.value ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {taskCounts[f.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
