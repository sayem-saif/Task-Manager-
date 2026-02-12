import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import AddTaskForm from "@/components/AddTaskForm";
import FilterBar, { FilterType, SortType } from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import EditTaskModal from "@/components/EditTaskModal";
import StatsBar from "@/components/StatsBar";
import ProgressTracker from "@/components/ProgressTracker";
import { Task } from "@/types/task";
import { dummyTasks } from "@/data/dummyTasks";
import { useTaskNotifications } from "@/hooks/useRealTime";

const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

interface IndexProps {
  studentName: string;
  onLogout: () => void;
}

const Index = ({ studentName, onLogout }: IndexProps) => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("dueDate");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { permission, requestPermission, notify } = useTaskNotifications();

  const todayStr = new Date().toISOString().split("T")[0];

  const addTask = (task: Task) => setTasks((prev) => [task, ...prev]);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayStr : undefined }
          : t
      )
    );

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const saveTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  };

  const handleToggleNotifications = useCallback(async () => {
    if (permission !== "granted") {
      await requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (permission !== "granted") return;
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return;
        const timeStr = task.dueTime || "23:59";
        const due = new Date(`${task.dueDate}T${timeStr}:00`);
        const hoursLeft = (due.getTime() - now.getTime()) / 3600000;
        if (hoursLeft > 0 && hoursLeft <= 1) {
          notify("Task Due Soon!", `"${task.title}" is due in less than an hour!`);
        }
      });
    }, 300000);
    return () => clearInterval(interval);
  }, [tasks, permission, notify]);

  const isOverdue = (t: Task) => {
    if (t.completed || !t.dueDate) return false;
    const timeStr = t.dueTime || "23:59";
    return new Date(`${t.dueDate}T${timeStr}:00`) < new Date();
  };

  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  const overdueCount = useMemo(() => tasks.filter(isOverdue).length, [tasks]);

  const filteredAndSorted = useMemo(() => {
    let result = [...tasks];
    if (filter === "pending") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    result.sort((a, b) => {
      if (sort === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const aFull = `${a.dueDate}T${a.dueTime || "23:59"}`;
        const bFull = `${b.dueDate}T${b.dueTime || "23:59"}`;
        return aFull.localeCompare(bFull);
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return result;
  }, [tasks, filter, sort]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 gradient-hero" />
      <div className="pointer-events-none fixed -top-60 -right-60 h-[500px] w-[500px] rounded-full bg-primary/3 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-primary/3 blur-3xl" />

      <div className="relative">
        <Header
          studentName={studentName}
          onLogout={onLogout}
        />
        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
          <div className="space-y-5">
            <StatsBar
              total={tasks.length}
              pending={taskCounts.pending}
              completed={taskCounts.completed}
              overdue={overdueCount}
            />
            <ProgressTracker tasks={tasks} />
            <AddTaskForm onAdd={addTask} />
            <FilterBar
              filter={filter}
              sort={sort}
              onFilterChange={setFilter}
              onSortChange={setSort}
              taskCounts={taskCounts}
            />
            <TaskList
              tasks={filteredAndSorted}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={setEditingTask}
            />
          </div>
        </main>
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={saveTask} />
      </div>
    </div>
  );
};

export default Index;
