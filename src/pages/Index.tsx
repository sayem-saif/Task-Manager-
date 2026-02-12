import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import AddTaskForm from "@/components/AddTaskForm";
import FilterBar, { FilterType, SortType } from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import EditTaskModal from "@/components/EditTaskModal";
import StatsBar from "@/components/StatsBar";
import ProgressTracker from "@/components/ProgressTracker";
import { StatsBarSkeleton, ProgressTrackerSkeleton, TaskListSkeleton } from "@/components/LoadingSkeleton";
import { Task } from "@/types/task";
import { useTaskNotifications } from "@/hooks/useRealTime";
import { useToast } from "@/hooks/use-toast";
import * as taskApi from "@/api/taskApi";

const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

interface IndexProps {
  studentName: string;
  onLogout: () => void;
}

const Index = ({ studentName, onLogout }: IndexProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("dueDate");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { permission, requestPermission, notify } = useTaskNotifications();
  const { toast } = useToast();

  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getTasks();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Task) => {
    try {
      const newTask = await taskApi.createTask({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        priority: task.priority
      });
      
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: "Success",
        description: "Task created successfully"
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const saveTask = async (updated: Task) => {
    try {
      const updatedTask = await taskApi.updateTask(updated.id, {
        title: updated.title,
        description: updated.description,
        dueDate: updated.dueDate,
        dueTime: updated.dueTime,
        priority: updated.priority
      });
      
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updatedTask : t)));
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
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
          {isLoading ? (
            <div className="space-y-5 animate-fadeIn">
              <StatsBarSkeleton />
              <ProgressTrackerSkeleton />
              <div className="rounded-2xl glass p-6 shadow-card">
                <div className="h-10 mb-4 bg-muted/30 rounded-xl animate-pulse" />
              </div>
              <TaskListSkeleton />
            </div>
          ) : (
            <div className="space-y-5">
              <StatsBar
                total={tasks.length}
                pending={taskCounts.pending}
                completed={taskCounts.completed}
                overdue={overdueCount}
              />
              <ProgressTracker tasks={tasks} />
              <AddTaskForm onAdd={addTask} />
              {tasks.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className="rounded-2xl glass p-12 text-center">
                  <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
                </div>
              )}
            </div>
          )}
        </main>
        <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={saveTask} />
      </div>
    </div>
  );
};

export default Index;
