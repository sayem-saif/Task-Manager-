import { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import { ClipboardList, Plus } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList = ({ tasks, onToggle, onDelete, onEdit }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl glass py-20 text-center shadow-card animate-fade-in">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <p className="text-base font-bold text-foreground">No tasks yet</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Click "Add New Task" to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, i) => (
        <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
          <TaskCard
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
