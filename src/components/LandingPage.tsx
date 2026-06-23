import React, { useState } from "react";
import { Terminal, Shield, Zap, Award, Sparkles, HelpCircle, Code, Layers, MessageSquare, Star, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStartGen: (plan: "Pro" | "Premium") => void;
  onNavigateToAdmin?: () => void;
  isAdmin?: boolean;
}

export default function LandingPage({ onStartGen, onNavigateToAdmin, isAdmin }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Saurabh Sharma",
      role: "Backend Engineer",
      text: "The cyberpunk theme completely transformed my profile. My github connection count went from zero to dozens in days. READMEForge is insane!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Meera Nair",
      role: "UI/UX Artisan",
      text: "Highly optimized output with gorgeous badges and contribution metrics. It took me 2 minutes to generate a beautiful resume profile.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Devendra Verma",
      role: "Full Stack Lead",
      text: "The AI Generated Bio on the Premium plan was surprisingly accurate and crisp. Totally worth the ₹99 price point.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    }
  ];

  const faqs = [
    {
      q: "What is READMEForge?",
      a: "READMEForge is a full-stack, AI-powered generation SaaS that helps developers craft outstanding, visual-first GitHub Profile README files. It includes high-fidelity typing widgets, contribution lines, skills badges, and visual panels, themed specifically to match your personality."
    },
    {
      q: "How does the Cashfree payment work?",
      a: "For our Premium layout, you instantly pay via a secure, official Cashfree API checkout window that supports UPI, Cards, and Netbanking. Once payment is recorded, our background server securely generates your README.md format."
    },
    {
      q: "Is the output standard GitHub Markdown?",
      a: "Yes! Every template, badge and responsive card is guaranteed to load perfectly in GitHub's native parser without any external client setups."
    },
    {
      q: "What is included in the Premium Plan?",
      a: "The Premium plan removes all watermarks, unlocks all premium profile themes, and implements custom, high-accuracy AI personal bio options, giving you a top-1% developer portfolio or career resume page."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-black text-[#F5F5F5] font-sans" id="landing-page-root">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20 md:pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center text-white">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-orange mb-8 font-mono animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Engineered Profile Generator
          </div>

          <div className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-white/40 font-mono">
            Elevate Your Github Identity
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[85px] font-black italic uppercase tracking-tighter text-white mb-8 max-w-5xl mx-auto leading-[0.9] text-center">
            Forge a profile that <br />
            <span className="stroke-orange uppercase font-black" style={{ WebkitTextStroke: "2px #F27D26", color: "transparent" }}>
              COMMANDS ATTENTION
            </span>
          </h1>

          <p className="text-base text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-medium px-4">
            Stunning animated headers, live typing indicators, accurate GitHub stat blocks, and skill badges. Instantly produced using Google Gemini AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <button
              onClick={() => onStartGen("Premium")}
              className="w-full px-8 py-4 bg-brand-orange text-black font-black uppercase text-xs tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              id="hero-generate-btn"
            >
              Generate Premium README
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>

          {/* Quick interactive mock representation */}
          <div className="mt-16 bg-white/5 border border-white/10 rounded-none p-4 sm:p-6 max-w-3xl mx-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-500 rounded-none" />
                <span className="w-3 h-3 bg-yellow-500 rounded-none" />
                <span className="w-3 h-3 bg-green-500 rounded-none" />
                <span className="text-xs text-white/50 font-mono ml-2">john_doe/README.md</span>
              </div>
              <div className="px-2 py-0.5 border border-white/15 bg-[#111] text-[10px] text-brand-orange font-mono uppercase tracking-wider">
                CYBERPUNK THEME
              </div>
            </div>
            
            <div className="text-left font-mono text-xs sm:text-sm space-y-3.5 text-white/80 overflow-x-auto select-none">
              <div><span className="text-brand-orange">{"<p align=\"center\">"}</span></div>
              <div className="pl-4 text-white/60">{"<img src=\"https://readme-typing-svg.demolab.com?lines=Creative+Developer;Stack+SaaS+Alchemist\" />"}</div>
              <div><span className="text-brand-orange">{"</p>"}</span></div>
              <p className="text-white/40 font-bold"># Hi there, I'm John Doe 👋</p>
              <p className="text-brand-orange/90 font-bold">### 🛠️ Core Weaponry</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-yellow-600">![React]</span><span className="text-white/40">(![React-badge])</span>
                <span className="text-yellow-600">![TS]</span><span className="text-white/40">(![TS-badge])</span>
                <span className="text-yellow-600">![Node]</span><span className="text-white/40">(![Node-badge])</span>
              </div>
              <p className="text-brand-orange/90 font-bold">### 📊 Realtime Quantified Profile</p>
              <div className="text-white/40 pl-4 border-l border-white/25">
                {"![StatsCard](https://github-readme-stats.vercel.app/api?username=john_doe&theme=tokyonight)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bento Section */}
      <div className="py-20 bg-white/[0.02] border-y border-white/10" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange mb-2 font-mono">Engine Architecture</div>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Inside READMEForge Tech</h2>
            <p className="text-white/60 max-w-xl mx-auto font-sans mt-2">
              Outstanding layout configurations engineered explicitly to upgrade developer profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 hover:border-brand-orange/30 transition duration-300">
              <div className="p-3 bg-white/5 text-brand-orange w-fit mb-6 border border-white/10">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">Preset Themes</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Choose from Cyberpunk, Hacker, Minimal, Gaming or Anime. Colors and modules are auto-optimized to fit your precise identity.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 hover:border-brand-orange/30 transition duration-300">
              <div className="p-3 bg-white/5 text-brand-orange w-fit mb-6 border border-white/10">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">Gemini AI Engine</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Skip writing resume templates. Let modern Google Gemini modeling synthesize a professional developer story based on your skills.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 hover:border-brand-orange/30 transition duration-300">
              <div className="p-3 bg-white/5 text-brand-orange w-fit mb-6 border border-white/10">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">Contribution Metrics</h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                Connect your active streak counts, repo analytics, languages used, and user dashboards securely with no API tokens required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6" id="pricing-section">
        <div className="text-center mb-12 md:mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange mb-2 font-mono">Pricing Gateway</div>
          <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">Forge Your Premium Portfolio</h2>
          <p className="text-white/60 mt-2 text-xs sm:text-sm font-sans">Power up your profile instantly. Secure payment verified via Cashfree.</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Unified Premium Card */}
          <div className="bg-white/5 border-2 border-brand-orange p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl">
            <div className="absolute top-0 right-6 sm:right-8 -translate-y-1/2 bg-brand-orange text-black text-[9px] sm:text-[10px] font-black px-2.5 py-1 uppercase tracking-wider">
              50% Promotional Discount
            </div>
            <div>
              <div className="text-brand-orange text-[10px] tracking-widest font-mono font-bold mb-2 uppercase">ELITE ALL-ACCESS</div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1">Premium Portfolio Forge</h3>
              <p className="text-white/50 text-[11px] sm:text-xs mb-6 font-mono uppercase">Unleash the ultimate visual developer index.</p>
              
              <div className="flex items-baseline gap-2.5 mb-6 border-b border-brand-orange/15 pb-5">
                <span className="text-3xl sm:text-4xl font-black text-brand-orange">Free</span>
                <span className="text-white/40 text-[10px] font-mono lowercase">(No Payment Required)</span>
              </div>

              <ul className="space-y-3.5 mb-8 text-[11px] sm:text-xs font-mono text-white/85 uppercase tracking-wide">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-orange" />
                  All 7 Premium Visual Themes
                </li>
                <li className="flex items-center gap-2 font-bold text-brand-orange">
                  <Sparkles className="w-4 h-4" />
                  Full Gemini AI Bio Summary Engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-orange" />
                  Typing SVG Widgets & Custom Badges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-orange" />
                  Realtime Contribution Grid Sync
                </li>
                <li className="flex items-center gap-2 font-bold text-brand-orange">
                  <Award className="w-4 h-4 text-brand-orange" />
                  Zero Watermark on Output
                </li>
              </ul>
            </div>

            <button
              onClick={() => onStartGen("Premium")}
              className="w-full py-3.5 sm:py-4 bg-brand-orange hover:bg-brand-orange/90 text-black font-black uppercase text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              id="landing-pro-select"
            >
              Get Premium Forge (Free)
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white/[0.01] border-t border-white/10" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange mb-2 font-mono">Peer Endorsements</div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Endorsed by Top Developers</h2>
            <p className="text-white/60 font-sans mt-1">See how other developers made their portfolios pop.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 sm:p-8 relative">
                <div className="flex items-center gap-1 text-brand-orange mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-orange stroke-brand-orange" />)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 font-sans italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-sm object-cover border border-white/10" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white tracking-wider">{t.name}</h4>
                    <span className="text-[10px] font-mono text-white/40 block mt-0.5">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 max-w-4xl mx-auto px-4 border-t border-white/10" id="faq-section">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#F27D26] mb-2 font-mono">FAQ Matrix</div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white/5 border border-white/10 overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between text-white font-bold uppercase tracking-wide text-xs hover:bg-white/5 transition animate-fade-in"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-brand-orange font-mono">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4 bg-black/40 font-sans animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Callback section */}
      <footer className="border-t border-white/10 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#F27D26] rounded-sm flex items-center justify-center font-black text-black text-base">R</div>
            <span className="text-base font-bold tracking-tighter text-white uppercase italic">READMEFORGE</span>
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider text-center md:text-left">
            © 2026 READMEFORGE. HANDCRAFTED FOR NEXT-GEN PROFILES. INTEGRATED WITH CASHFREE PAY.
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-black transition cursor-pointer"
                id="footer-admin-link"
              >
                Admin Terminal
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
