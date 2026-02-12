import { useState } from "react";
import { BookOpen, ArrowRight, Zap, Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useToast } from "@/hooks/use-toast";
import * as authApi from "@/api/authApi";

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
  onLogin: (token: string, userName: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({ email, password });

      toast({
        title: "Success!",
        description: "Logged in successfully",
      });

      onLogin(data.token, data.user.name);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password });

      // Check if user was auto-verified (email not configured)
      if (data.user.isVerified && data.token) {
        toast({
          title: "Registration Successful!",
          description: data.message || "Account created successfully",
        });
        onLogin(data.token, data.user.name);
      } else {
        setShowVerificationMessage(true);
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account",
        });

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
        <div className="pointer-events-none absolute inset-0 gradient-hero" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute right-4 top-4 z-10">
          <DarkModeToggle />
        </div>

        <div className="relative w-full max-w-md animate-fade-in text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-primary shadow-glow">
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Check Your Email!
          </h1>
          
          <div className="rounded-2xl glass p-8 shadow-card">
            <Mail className="h-16 w-16 mx-auto mb-4 text-primary" />
            <p className="text-foreground mb-4">
              We've sent a verification link to your email address.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Please check your inbox and click the verification link to complete your registration.
            </p>
            <button
              onClick={() => {
                setShowVerificationMessage(false);
                setIsLogin(true);
              }}
              className="w-full rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition-all"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="mb-6 flex gap-2 rounded-xl bg-secondary/60 p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                isLogin
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                !isLogin
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus={isLogin}
                  className="w-full rounded-xl border border-input bg-background/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>
                {isLogin ? "Login" : "Create Account"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Register now" : "Login here"}
            </button>
          </p>
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
