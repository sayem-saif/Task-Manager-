import { useState } from "react";
import { BookOpen, ArrowRight, Zap } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

const quotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Success is the sum of small efforts repeated day in and day out.",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
];

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [name, setName] = useState("");
  const [quoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="absolute right-4 top-4 z-10">
        <DarkModeToggle />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-glow">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Taskager
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Organize. Focus. Achieve.</p>
        </div>

        {/* Quote */}
        <div className="mb-6 animate-slide-up rounded-2xl border border-primary/10 bg-primary/5 p-5">
          <p className="text-center text-sm italic leading-relaxed text-foreground/80">
            "{quotes[quoteIndex]}"
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="animate-slide-up rounded-2xl glass p-7 shadow-card">
          <label htmlFor="student-name" className="mb-2 block text-sm font-semibold text-foreground">
            What's your name?
          </label>
          <input
            id="student-name"
            type="text"
            placeholder="Enter your name to get started…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="mb-5 w-full rounded-xl border border-input bg-background/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="group flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>Stay organized, stay ahead</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
