import { Task } from "@/types/task";

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const fmtTime = (d: Date) => d.toTimeString().slice(0, 5);

export const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Complete Math Assignment",
    description: "Finish chapters 5-7 exercises on calculus integration.",
    dueDate: fmt(new Date(today.getTime() + 2 * 86400000)),
    dueTime: "14:00",
    priority: "High",
    completed: false,
  },
  {
    id: "2",
    title: "Read History Chapter",
    description: "Read chapter 12 on the Industrial Revolution and take notes.",
    dueDate: fmt(new Date(today.getTime() + 5 * 86400000)),
    dueTime: "18:00",
    priority: "Medium",
    completed: false,
  },
  {
    id: "3",
    title: "Submit Lab Report",
    description: "Write up the biology lab experiment from last week.",
    dueDate: fmt(new Date(today.getTime() - 1 * 86400000)),
    dueTime: "09:00",
    priority: "High",
    completed: false,
  },
  {
    id: "4",
    title: "Group Project Meeting",
    description: "Meet with team to discuss project milestones.",
    dueDate: fmt(new Date(today.getTime() + 1 * 86400000)),
    dueTime: "10:30",
    priority: "Low",
    completed: true,
    completedAt: fmt(new Date(today.getTime() - 1 * 86400000)),
  },
  {
    id: "5",
    title: "Prepare Presentation Slides",
    description: "Create slides for the English literature presentation.",
    dueDate: fmt(new Date(today.getTime() + 7 * 86400000)),
    dueTime: "16:00",
    priority: "Medium",
    completed: false,
  },
];
