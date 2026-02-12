import { BookOpen, LogOut } from "lucide-react";
import LiveClock from "./LiveClock";
import DarkModeToggle from "./DarkModeToggle";

interface HeaderProps {
  studentName?: string;
  onLogout?: () => void;
}

const Header = ({ studentName, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              {studentName ? (
                <>Welcome, <span className="text-primary font-extrabold">{studentName}</span></>
              ) : (
                "Taskager"
              )}
            </h1>
            <p className="text-[11px] text-muted-foreground">Stay organized, stay ahead</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <LiveClock />
          </div>
          <DarkModeToggle />
          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:scale-105"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
