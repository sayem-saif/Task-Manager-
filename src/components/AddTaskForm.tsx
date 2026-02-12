import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Priority, Task } from "@/types/task";

interface AddTaskFormProps {
  onAdd: (task: Task) => void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      completed: false,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("Medium");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 px-4 py-5 text-sm font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/10 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary shadow-sm transition-transform group-hover:scale-110">
          <Plus className="h-4 w-4 text-primary-foreground" />
        </div>
        Add New Task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl glass p-6 shadow-card animate-scale-in"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">New Task</h3>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3.5">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        <textarea
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Due Time</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-xl gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
