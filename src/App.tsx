import React, { useState, useEffect } from "react";
import { Terminal, Github, User as UserIcon, LogOut, Settings, Award, Code, Compass, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { User, Order, ReadmeUserData } from "./types";
import LandingPage from "./components/LandingPage";
import ReadmeForm from "./components/ReadmeForm";
import OutputView from "./components/OutputView";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [session, setSession] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<"landing" | "build" | "output" | "admin">("landing");
  
  // Order flow variables
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // GitHub Auth popup modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormUsername, setAuthFormUsername] = useState("john_doe");
  const [authFormEmail, setAuthFormEmail] = useState("john_doe@github.com");
  const [authFormName, setAuthFormName] = useState("John Doe");
  const [authFormPassword, setAuthFormPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/session");
      if (res.ok) {
        const data = await res.json();
        setSession(data.user);
      }
    } catch (e) {
      console.log("API session fetch response: Defaulting local memory state.");
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    // Check for payment success redirect
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const paymentStatus = urlParams.get('payment');
    const unlocked = urlParams.get('unlocked');

    if (orderId && paymentStatus === 'success') {
      // Fetch the order and show output view
      fetch(`/api/orders`)
        .then(res => res.json())
        .then(orders => {
          const paidOrder = orders.find((o: Order) => o.id === orderId && o.status === 'PAID');
          if (paidOrder) {
            setActiveOrder(paidOrder);
            setCurrentStep('output');
            // Clear URL parameters but keep the success state
            window.history.replaceState({}, '', '/');
          }
        })
        .catch(err => console.error('Error fetching order:', err));
    }
  }, []);

  const handleGitHubLoginSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/github/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: authFormUsername,
          displayName: authFormName,
          email: authFormEmail,
          password: authFormPassword,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data.user);
        setShowAuthModal(false);
        setAuthFormPassword(""); // Clear security credential from local memory
      } else {
        const errData = await res.json();
        alert(errData.error || "Simulated login failed. Action rolled back.");
      }
    } catch (err) {
      console.error(err);
      alert("Network exception establishing simulated session.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      setCurrentStep("landing");
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartGeneration = (plan: "Pro" | "Premium") => {
    setCurrentStep("build");
  };

  const handleOrderSubmission = async (formData: ReadmeUserData, theme: string, plan: "Pro" | "Premium") => {
    try {
      // Generate README directly without payment using API
      const res = await fetch("/api/readme/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: { ...formData, theme },
          theme,
          plan,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to generate README: " + (err.error || "Please try again"));
        return;
      }

      const data = await res.json();
      
      // Create a mock order for display purposes
      const mockOrder: Order = {
        id: "order_" + Math.random().toString(36).substring(2, 10),
        userId: session?.id || "guest",
        username: session?.username || "guest",
        plan,
        amount: 0,
        status: "PAID",
        cashfreeOrderId: "",
        readmeData: formData,
        generatedReadme: data.markdown,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setActiveOrder(mockOrder);
      setCurrentStep("output");
    } catch (e: any) {
      console.error("README generation error:", e);
      alert("Failed to generate README. Please try again.");
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center font-mono space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span>Powering up READMEForge Engine...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-[#F5F5F5] font-sans flex flex-col" id="app-shell-root">
      
      {/* Top Universal Layout Nav */}
      <header className="border-b border-white/10 bg-brand-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep("landing")}
            className="flex items-center gap-2 hover:opacity-95 transition text-left cursor-pointer"
          >
            <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center font-black text-black text-xl">R</div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">READMEFORGE</span>
          </button>

          {/* Center quick links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-white/60 animate-fade-in">
            <button onClick={() => setCurrentStep("landing")} className="hover:text-brand-orange transition-colors">Sales Overview</button>
            <button onClick={() => handleStartGeneration("Premium")} className="hover:text-brand-orange transition-colors">Workspace</button>
          </nav>

          {/* Authentication Panel */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep("admin")}
              className={`px-2.5 py-2 sm:px-4 border text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${currentStep === "admin" ? "bg-brand-orange border-brand-orange text-black font-extrabold" : "border-white/15 text-white hover:bg-white/5"}`}
            >
              <Settings className="w-3.5 h-3.5 text-brand-orange" />
              <span className="hidden sm:inline">Admin Terminal</span>
            </button>

            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-sm pr-3">
                  <img src={session.avatarUrl} alt={session.displayName} className="w-6 h-6 rounded-sm object-cover" />
                  <div className="text-left leading-none max-w-[100px] truncate hidden sm:block">
                    <span className="text-[10px] text-white/70 font-mono font-bold block truncate">@{session.username}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-white/40 hover:text-brand-orange transition-colors cursor-pointer"
                  title="Disconnect Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors-all flex items-center gap-2 cursor-pointer"
                id="header-connect-github-btn"
              >
                <Github className="w-4 h-4" />
                Simulate Link
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Primary Routed View Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8" id="primary-application-main">
        {currentStep === "landing" && (
          <LandingPage
            onStartGen={handleStartGeneration}
            onNavigateToAdmin={() => setCurrentStep("admin")}
            isAdmin={true}
          />
        )}

        {currentStep === "build" && (
          <ReadmeForm
            initialPlan="Premium"
            onSubmitOrder={handleOrderSubmission}
            onBackToLanding={() => setCurrentStep("landing")}
          />
        )}

        {currentStep === "output" && activeOrder && (
          <OutputView
            order={activeOrder}
            onEditAgain={() => setCurrentStep("build")}
          />
        )}

        {currentStep === "admin" && (
          <AdminDashboard
            onBack={() => setCurrentStep("landing")}
          />
        )}
      </main>

      {/* SIMULATED GITHUB OAUTH POPUP MODAL (ESSENTIAL TO BYPASS IFRAME RESTRICTIONS) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="github-auth-modal">
          <div className="bg-brand-black border border-white/15 p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left">
            <div className="flex items-center gap-2 mb-4 b-b border-white/10 pb-3">
              <Github className="w-6 h-6 text-brand-orange" />
              <h2 className="text-lg font-black uppercase tracking-tight text-white">Simulate GitHub Connection</h2>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-6 font-mono">
              CONNECT A MOCKED PORTFOLIO PROFILE INSTANTLY. BECOME THE PROJECT OWNER OR A BRAND NEW CREATOR.
            </p>

            <form onSubmit={handleGitHubLoginSimulate} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1" htmlFor="github-auth-username">GitHub Username</label>
                <input
                  id="github-auth-username"
                  type="text"
                  required
                  value={authFormUsername}
                  onChange={(e) => {
                    setAuthFormUsername(e.target.value);
                    if (e.target.value === "vivekkumarpatar") {
                      setAuthFormEmail("vivekkumarpatar2007@gmail.com");
                      setAuthFormName("Vivek Kumar");
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                  placeholder="e.g. john_doe"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1" htmlFor="github-auth-name">Display Name</label>
                <input
                  id="github-auth-name"
                  type="text"
                  required
                  value={authFormName}
                  onChange={(e) => setAuthFormName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1" htmlFor="github-auth-email">Assigned Email</label>
                <input
                   id="github-auth-email"
                  type="email"
                  required
                  value={authFormEmail}
                  onChange={(e) => setAuthFormEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                  placeholder="e.g. user@gmail.com"
                />
                <p className="text-[10px] text-white/40 mt-1 font-mono uppercase tracking-tight">
                  💡 Email <span className="text-brand-orange">vivekkumarpatar2007@gmail.com</span> TRIGGER FOR ADMIN ACCESS.
                </p>
              </div>

              {authFormEmail.trim().toLowerCase() === "vivekkumarpatar2007@gmail.com" && (
                <div className="animate-fade-in space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-orange font-mono" htmlFor="github-auth-password">
                    Admin Password Required
                  </label>
                  <input
                    id="github-auth-password"
                    type="password"
                    required
                    value={authFormPassword}
                    onChange={(e) => setAuthFormPassword(e.target.value)}
                    className="w-full bg-white/5 border border-brand-orange/45 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="Enter admin password"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="flex-1 py-3.5 bg-brand-orange hover:bg-brand-orange/90 text-black text-xs font-black uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                  id="submit-auth-simulate"
                >
                  {authLoading ? "ESTABLISHING..." : "Establish Session"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-6 py-3.5 border border-white/10 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
