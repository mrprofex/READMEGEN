import React, { useState, useEffect } from "react";
import { Terminal, Code, Sparkles, Plus, Trash2, Shield, Eye, HelpCircle, Lock, Layout, Star, ChevronDown, CheckCircle2 } from "lucide-react";
import { ReadmeUserData, ProjectData } from "../types";

interface ReadmeFormProps {
  initialPlan: "Pro" | "Premium";
  onSubmitOrder: (formData: ReadmeUserData, theme: string, plan: "Pro" | "Premium") => void;
  onBackToLanding: () => void;
}

const THEMES = [
  { name: "Cyberpunk", desc: "Neon cyan/magenta coding weapon", plan: "Pro" },
  { name: "Hacker", desc: "Monospaced green grid console", plan: "Pro" },
  { name: "Orange Fire", desc: "Aggressive blazing warm streaks", plan: "Pro" },
  { name: "Minimal", desc: "Pristine white quiet elegance", plan: "Pro" },
  { name: "Anime", desc: "Cheerful quote card visuals", plan: "Pro" },
  { name: "Gaming", desc: "Dynamic XP progress gauges", plan: "Pro" },
  { name: "Professional", desc: "Polished deep slate blueprint", plan: "Pro" }
];

const SKILL_OPTIONS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Python",
  "Java", "C++", "Docker", "AWS", "Google Cloud"
];

export default function ReadmeForm({ initialPlan, onSubmitOrder, onBackToLanding }: ReadmeFormProps) {
  const [activeTab, setActiveTab2] = useState<string>("basic");
  const [selectedTheme, setSelectedTheme] = useState<string>("Cyberpunk");
  const [currentPlan, setCurrentPlan] = useState<"Pro" | "Premium">(initialPlan);

  // Form states matching types.ts with demo placeholder defaults
  const [formData, setFormData] = useState<ReadmeUserData>({
    name: "John Doe",
    githubUsername: "john_doe",
    tagline: "Full Stack Engineer & Creative Builder",
    bio: "Obsessed with full-stack optimization, clean layouts, and responsive interfaces.",
    location: "New York, USA",
    github: "https://github.com/john_doe",
    linkedin: "https://linkedin.com/in/john_doe",
    twitter: "https://twitter.com/john_doe",
    instagram: "",
    portfolio: "https://john.dev",
    discord: "",
    skills: ["React", "TypeScript", "Node.js", "Next.js", "Express.js"],
    learningGoals: "Dynamic WebSockets & serverless computing",
    projects: [
      {
        name: "READMEForge",
        description: "AI-powered custom GitHub Profile README generation platform.",
        githubUrl: "https://github.com/john_doe/readmeforge"
      }
    ],
    sections: {
      headerWave: true,
      typingIndicator: true,
      developerDashboard: true,
      connectWithMe: true,
      skillsList: true,
      currentJourney: true,
      developerActivity: true,
      contributionStreak: true,
      featuredProjects: true,
      spotlightSlider: true,
      funFacts: true,
      learningRoadmap: true,
    }
  });

  const toggleSection = (sectionKey: string) => {
    setFormData((prev) => {
      const currentSections = prev.sections || {
        headerWave: true,
        typingIndicator: true,
        developerDashboard: true,
        connectWithMe: true,
        skillsList: true,
        currentJourney: true,
        developerActivity: true,
        contributionStreak: true,
        featuredProjects: true,
        spotlightSlider: true,
        funFacts: true,
        learningRoadmap: true,
      };
      return {
        ...prev,
        sections: {
          ...currentSections,
          [sectionKey]: !currentSections[sectionKey as keyof typeof currentSections]
        }
      };
    });
  };

  // Client preview generation
  const [previewMarkdown, setPreviewMarkdown] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"visual" | "markdown">("visual");

  const triggerPreviewFetch = async () => {
    setIsPreviewLoading(true);
    try {
      const res = await fetch("/api/readme/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: formData,
          theme: selectedTheme,
          plan: currentPlan
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewMarkdown(data.markdown);
      }
    } catch (e) {
      console.error("Failed to generate client-side preview:", e);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    // Generate real-time preview on input change
    const debounceTimer = setTimeout(() => {
      triggerPreviewFetch();
    }, 600);
    return () => clearTimeout(debounceTimer);
  }, [formData, selectedTheme, currentPlan]);

  const updateField = (field: keyof ReadmeUserData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", githubUrl: "" }]
    }));
  };

  const handleRemoveProject = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  const handleProjectChange = (idx: number, field: keyof ProjectData, val: string) => {
    setFormData((prev) => {
      const projects = [...prev.projects];
      projects[idx] = { ...projects[idx], [field]: val };
      return { ...prev, projects };
    });
  };

  // Convert some markup to HTML simulator
  const renderSimulatedReadmeHtml = () => {
    if (!previewMarkdown) return <p className="text-slate-500 font-mono text-xs">Awaiting markup initialization...</p>;

    // Let's do regex replacing to make the preview look outstanding
    let html = previewMarkdown;

    // Remove any alignment tags or make them div blocks
    html = html.replace(/<p align="center">/g, '<div class="text-center my-4">');
    html = html.replace(/<\/p>/g, '</div>');

    // Headers
    html = html.replace(/^#\s+(.*)/gm, '<h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 border-b border-slate-800 pb-2 mt-6 mb-4">$1</h1>');
    html = html.replace(/^##\s+(.*)/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-slate-850 pb-1">$1</h2>');
    html = html.replace(/^###\s+(.*)/gm, '<h3 class="text-base font-semibold text-indigo-400 mt-4 mb-2">$1</h3>');

    // Quotes and blocks
    html = html.replace(/^>\s+(.*)/gm, '<div class="border-l-4 border-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-r-lg my-3 text-slate-300 italic text-sm">$1</div>');

    // Lists
    html = html.replace(/^-\s+(.*)/gm, '<li class="text-sm text-slate-300 list-disc ml-5 mb-1.5">$1</li>');

    // Image tags (like typing widgets or badges)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img class="inline-block max-w-full my-1.5 hover:scale-[1.02] transition-transform duration-100" src="$2" alt="$1" style="border-radius: 4px; border: 1px solid rgba(255,255,255,0.02);" />');

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Dividers
    html = html.replace(/^---/gm, '<hr class="border-slate-800 my-6" />');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="text-indigo-400 hover:underline" href="$2" target="_blank">$1</a>');

    return (
      <div className="space-y-4 prose prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  const isThemePremium = THEMES.find((t) => t.name === selectedTheme)?.plan === "Pro";

  return (
    <div className="min-h-screen bg-brand-black text-[#F5F5F5] font-sans p-4 sm:p-6 md:p-8 animate-fade-in" id="generator-root">
       {/* Upper Navigation Control */}
       <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-white/10 text-center sm:text-left">
         <div className="flex flex-col sm:flex-row items-center gap-3">
           <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center font-black text-black text-xl mx-auto sm:mx-0">W</div>
           <div>
             <h1 className="text-lg font-black uppercase tracking-tight text-white">Workspace Studio</h1>
             <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Profile Sandbox</span>
           </div>
         </div>
 
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
           {/* Plan Switcher Pills representing our integrated single Premium Tier */}
           <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-none mx-auto sm:mx-0">
             <span className="w-2 h-2 bg-brand-orange animate-pulse rounded-full" />
             <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">Premium Plan (Free)</span>
           </div>
 
           <button
             onClick={onBackToLanding}
             className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition cursor-pointer w-full sm:w-auto"
           >
             ← Exit Workspace
           </button>
         </div>
       </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input parameters */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-none p-5 sm:p-6 shadow-2xl relative space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-orange" />
              Profile Specifications
            </h2>
            <div className="text-[10px] border border-brand-orange bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-none font-mono uppercase font-bold tracking-wider">
              {currentPlan}
            </div>
          </div>

          {/* Form Tabs for Accordion Navigation */}
          <div className="grid grid-cols-6 gap-1 border-b border-white/10 pb-3">
            {[
              { id: "basic", label: "Basic" },
              { id: "social", label: "Socials" },
              { id: "skills", label: "Skills" },
              { id: "projects", label: "Repos" },
              { id: "sections", label: "Sections" },
              { id: "theme", label: "Themes" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab2(tab.id)}
                className={`text-[9px] uppercase tracking-wider font-extrabold py-2 border transition ${activeTab === tab.id ? "bg-brand-orange border-brand-orange text-black" : "bg-transparent border-white/5 text-white/60 hover:text-white hover:border-white/20"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* BASIC INFO ACCORDION */}
            {activeTab === "basic" && (
              <div className="space-y-4 transition-all duration-250 animate-fade-in" id="form-basic-tab">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-fullname">Full Name</label>
                  <input
                    id="field-fullname"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-github">GitHub Username</label>
                  <input
                    id="field-github"
                    type="text"
                    value={formData.githubUsername}
                    onChange={(e) => updateField("githubUsername", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="e.g. john_doe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-tagline">Tagline</label>
                  <input
                    id="field-tagline"
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="e.g. Crafting premium microservice logic"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-location">Location</label>
                  <input
                    id="field-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="e.g. New Delhi, India"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-bio">Core Professional Bio</label>
                  <textarea
                    id="field-bio"
                    value={formData.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className="w-full h-24 bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none resize-none font-sans"
                    placeholder="Write a brief professional description..."
                  />
                  {currentPlan === "Premium" && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-brand-orange font-bold uppercase tracking-tight bg-white/5 px-2.5 py-2.5 border border-white/10">
                      <Sparkles className="w-3.5 h-3.5" />
                      Premium Connected: Custom AI Personalized Engine will compose this bio on purchase.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SOCIALS ACCORDION */}
            {activeTab === "social" && (
              <div className="space-y-4 animate-fade-in" id="form-socials-tab">
                {[
                  { field: "github", label: "GitHub Profile", placeholder: "https://github.com/..." },
                  { field: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
                  { field: "twitter", label: "Twitter/X URL", placeholder: "https://twitter.com/..." },
                  { field: "instagram", label: "Instagram Link", placeholder: "https://instagram.com/..." },
                  { field: "portfolio", label: "Portfolio Website", placeholder: "https://yourwebsite.ly" },
                  { field: "discord", label: "Discord Username", placeholder: "username#1234" }
                ].map((s) => (
                  <div key={s.field}>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1" htmlFor={`social-${s.field}`}>{s.label}</label>
                    <input
                      id={`social-${s.field}`}
                      type="text"
                      value={(formData as any)[s.field] || ""}
                      onChange={(e) => updateField(s.field as keyof ReadmeUserData, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                      placeholder={s.placeholder}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS ACCORDION */}
            {activeTab === "skills" && (
              <div className="space-y-4 animate-fade-in text-left" id="form-skills-tab">
                <div>
                  <div className="text-[10px] font-bold text-white/50 mb-3 uppercase tracking-wider">Select Active Weapons:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_OPTIONS.map((skill) => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center justify-between p-3 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left rounded-none ${isSelected ? "bg-brand-orange border-brand-orange text-black" : "bg-white/5 border-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white"}`}
                        >
                          <span>{skill}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5" htmlFor="field-learning">Future Milestones (Learning Roadmap)</label>
                  <input
                    id="field-learning"
                    type="text"
                    value={formData.learningGoals}
                    onChange={(e) => updateField("learningGoals", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-sans"
                    placeholder="e.g. Distributed databases, Golang, WebGPU physics"
                  />
                </div>
              </div>
            )}

            {/* PROJECTS ACCORDION */}
            {activeTab === "projects" && (
              <div className="space-y-4 animate-fade-in" id="form-projects-tab">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Repositories Grid ({formData.projects.length})</span>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-orange/40 text-[10px] text-brand-orange hover:bg-brand-orange hover:text-black font-bold uppercase transition block cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Add Repository
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {formData.projects.map((proj, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-none space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="absolute top-3 right-3 text-white/40 hover:text-brand-orange transition cursor-pointer"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-1" htmlFor={`project-name-${idx}`}>Project Name</label>
                        <input
                          id={`project-name-${idx}`}
                          type="text"
                          value={proj.name}
                          onChange={(e) => handleProjectChange(idx, "name", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="e.g. READMEForge"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-1" htmlFor={`project-desc-${idx}`}>Description</label>
                        <input
                          id={`project-desc-${idx}`}
                          type="text"
                          value={proj.description}
                          onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="What did you build?"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-1" htmlFor={`project-url-${idx}`}>GitHub Link</label>
                        <input
                          id={`project-url-${idx}`}
                          type="text"
                          value={proj.githubUrl}
                          onChange={(e) => handleProjectChange(idx, "githubUrl", e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-none px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTIONS LAYOUT TOGGLER */}
            {activeTab === "sections" && (
              <div className="space-y-3 animate-fade-in text-left max-h-[350px] overflow-y-auto pr-1" id="form-sections-tab">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">
                  Toggle README Content Sections:
                </div>
                {[
                  { key: "headerWave", label: "🌊 Header Wave Design", desc: "Full-width dynamic waving gradient graphic title bar" },
                  { key: "typingIndicator", label: "💬 Animated Typing Intro", desc: "An animated typing text and profile views counter badge" },
                  { key: "developerDashboard", label: "🖥️ Developer Stats Grid", desc: "Three-column telemetry grid detailing target mode indicators" },
                  { key: "connectWithMe", label: "📱 Connect With Me Badges", desc: "Shield buttons linking to Social Networks/Discord handles" },
                  { key: "skillsList", label: "🛠️ Skill Interactive Grid", desc: "Logo icon grid highlighting tech stacks automatically" },
                  { key: "currentJourney", label: "🌍 Current Focus Journey", desc: "Professional roadmap bio details for future learning" },
                  { key: "developerActivity", label: "⚡ GitHub Activity Cards", desc: "GitHub stats, productive time summary cards, and language charts" },
                  { key: "contributionStreak", label: "🔥 Contribution Streak Counter", desc: "Demolab streak highlights directly from user's account" },
                  { key: "featuredProjects", label: "🚀 Featured Repositories Grid", desc: "Showcases specific custom software projects and links" },
                  { key: "spotlightSlider", label: "🎥 Developer Spotlight & Media", desc: "Interactive session stats with responsive neon sliders" },
                  { key: "funFacts", label: "🏆 Fun Facts & Achievements", desc: "Self-proclaimed achievements catalog and funny developer stats" },
                  { key: "learningRoadmap", label: "📊 Mermaid Roadmap Flowchart", desc: "Full interactive structured skill maps and developer details graph" },
                ].map((sec) => {
                  const sectionsVal = formData.sections || {
                    headerWave: true,
                    typingIndicator: true,
                    developerDashboard: true,
                    connectWithMe: true,
                    skillsList: true,
                    currentJourney: true,
                    developerActivity: true,
                    contributionStreak: true,
                    featuredProjects: true,
                    spotlightSlider: true,
                    funFacts: true,
                    learningRoadmap: true,
                  };
                  const isEnabled = sectionsVal[sec.key as keyof typeof sectionsVal] !== false;
                  return (
                    <div
                      key={sec.key}
                      onClick={() => toggleSection(sec.key)}
                      className={`p-3 border flex items-center justify-between cursor-pointer transition rounded-none bg-white/5 ${isEnabled ? "border-brand-orange text-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                    >
                      <div className="text-left max-w-[80%]">
                        <div className={`font-bold text-[11px] uppercase tracking-wide ${isEnabled ? "text-white" : "text-white/40"}`}>
                          {sec.label}
                        </div>
                        <span className="text-[9px] block mt-0.5 opacity-60 leading-tight">{sec.desc}</span>
                      </div>
                      <div className={`w-12 h-6 flex items-center px-1 rounded-full transition-colors duration-200 shrink-0 ${isEnabled ? "bg-brand-orange" : "bg-white/10"}`}>
                        <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isEnabled ? "translate-x-6" : "translate-x-0"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* THEMES ACCORDION */}
            {activeTab === "theme" && (
              <div className="space-y-4 animate-fade-in" id="form-themes-tab">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono mb-2">Select Visual Theme:</div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.name;

                    return (
                      <div
                        key={theme.name}
                        onClick={() => {
                          setSelectedTheme(theme.name);
                        }}
                        className={`p-3.5 border flex items-center justify-between cursor-pointer transition rounded-none ${isSelected ? "bg-white/5 border-brand-orange text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"}`}
                      >
                        <div className="text-left">
                          <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-2 text-white">
                            {theme.name}
                          </div>
                          <span className="text-[10px] text-white/40 block mt-0.5">{theme.desc}</span>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 bg-brand-orange flex items-center justify-center">
                            <span className="text-[10px] text-black font-black">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 border border-white/20" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action trigger button */}
          <button
            onClick={() => onSubmitOrder(formData, selectedTheme, "Premium")}
            className="w-full py-4 text-xs font-black uppercase tracking-widest text-center text-black bg-brand-orange hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:translate-y-0.5"
            id="workspace-submit-order"
          >
            <Sparkles className="w-4 h-4 text-black" />
            Generate README (Free)
          </button>
        </div>

        {/* Right: Live Simulator Workspace with blurred overlay cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-none border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-orange animate-pulse" />
              <span className="text-xs font-mono text-white/60 font-bold uppercase tracking-wider">COMPILATION PREVIEW</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode("visual")}
                className={`px-3 py-1 text-xs font-mono border transition ${previewMode === "visual" ? "text-white border-brand-orange bg-white/5" : "text-white/45 border-transparent hover:text-white"}`}
              >
                Visual Live
              </button>
              <button
                onClick={() => setPreviewMode("markdown")}
                className={`px-3 py-1 text-xs font-mono border transition flex items-center gap-1.5 ${previewMode === "markdown" ? "text-white border-brand-orange bg-white/5" : "text-white/45 border-transparent hover:text-white"}`}
                id="preview-md-tab"
              >
                Raw MD Code <Lock className="w-3 h-3 text-brand-orange" />
              </button>
            </div>
          </div>

          {/* Core frame containing mockup representation */}
          <div className="bg-white/5 border border-white/10 rounded-none p-6 relative overflow-hidden min-h-[500px]">
            {/* Loading placeholder spinner */}
            {isPreviewLoading ? (
              <div className="flex flex-col items-center justify-center absolute inset-0 bg-black/60 z-10 animate-fade-in">
                <div className="w-8 h-8 rounded-none border-2 border-brand-orange border-t-transparent animate-spin" />
                <span className="text-[10px] text-white/40 font-mono mt-3 uppercase tracking-wider">Re-compiling profile code...</span>
              </div>
            ) : null}

            {previewMode === "visual" ? (
              <div className="text-left select-none max-h-[600px] overflow-y-auto overflow-x-hidden pr-2">
                {renderSimulatedReadmeHtml()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/10 rounded-none h-[420px] text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 bg-brand-orange/15 text-brand-orange flex items-center justify-center border border-brand-orange/20 rounded-none mb-2">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Raw Source Markdown Code Locked</h3>
                <p className="text-xs text-white/60 max-w-sm leading-relaxed px-4">
                  The copyable and downloadable raw markdown code template is locked before completing your setup. Please finish your customization, choose a plan, and click &quot;Checkout&quot; to unlock full raw source access!
                </p>
                <button
                  type="button"
                  onClick={() => setPreviewMode("visual")}
                  className="px-4 py-2 border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-black font-extrabold uppercase text-[10px] tracking-wider transition-all cursor-pointer mt-2"
                >
                  Return to Visual Live Output
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
