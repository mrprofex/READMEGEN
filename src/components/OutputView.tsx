import React, { useState } from "react";
import { Copy, Download, ArrowLeft, Check, Sparkles, Terminal, Globe, Code } from "lucide-react";
import { Order } from "../types";

interface OutputViewProps {
  order: Order;
  onEditAgain: () => void;
}

export default function OutputView({ order, onEditAgain }: OutputViewProps) {
  const [copied, setCopied] = useState(false);
  const [tabMode, setTabMode] = useState<"visual" | "raw">("visual");

  const markdownContent = order.generatedReadme || `# ${order.readmeData.name}\nFailed to compile full dynamic AI variant. Using local system templates.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadmeFile = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Quick custom renderer for GitHub Markdown emulation on frontend
  const renderSimulatedHtmlOutput = () => {
    let html = markdownContent;

    // Convert layouts to center div
    html = html.replace(/<p align="center">/g, '<div class="text-center my-4">');
    html = html.replace(/<\/p>/g, '</div>');

    // Headers
    html = html.replace(/^#\s+(.*)/gm, '<h1 class="text-3xl font-extrabold text-white border-b border-slate-800 pb-2 mt-6 mb-4">$1</h1>');
    html = html.replace(/^##\s+(.*)/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-slate-850 pb-1">$1</h2>');
    html = html.replace(/^###\s+(.*)/gm, '<h3 class="text-base font-semibold text-indigo-400 mt-4 mb-2">$1</h3>');

    // Blockquotes
    html = html.replace(/^>\s+(.*)/gm, '<div class="border-l-4 border-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-r-lg my-3 text-slate-300 italic text-sm">$1</div>');

    // Bullets
    html = html.replace(/^-\s+(.*)/gm, '<li class="text-sm text-slate-300 list-disc ml-5 mb-1.5">$1</li>');

    // Responsive images and badges
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img class="inline-block max-w-full my-1.5 hover:scale-[1.01] transition" src="$2" alt="$1" />');

    // Bold tags
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Horizontal boundaries
    html = html.replace(/^---/gm, '<hr class="border-slate-800 my-6" />');

    // Links mapping
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="text-indigo-400 hover:underline" href="$2" target="_blank">$1</a>');

    return (
      <div className="space-y-4 prose prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in" id="output-view-root">
      
      {/* Top action indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onEditAgain}
            className="p-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-none transition cursor-pointer"
            title="Edit Details Again"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-mono">ORDER: {order.id}</span>
              <span className="text-[9px] font-black py-0.5 px-2 bg-brand-orange/15 text-brand-orange border border-brand-orange/20 rounded-none font-mono uppercase tracking-widest">
                Unlocked Build
              </span>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white flex items-center gap-2 mt-1">
              Your Profile is Ready!
              <Sparkles className="w-5 h-5 text-brand-orange" />
            </h2>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={copyToClipboard}
            className="w-full sm:w-auto px-6 py-4 bg-[#111] hover:bg-[#1a1a1a] text-white border border-white/10 rounded-none text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="copy-clipboard-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-brand-orange animate-scale-up" />
                Copied Code Box!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-orange" />
                Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={downloadReadmeFile}
            className="w-full sm:w-auto px-6 py-4 bg-brand-orange hover:bg-brand-orange/90 text-black rounded-none text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            id="download-readme-btn"
          >
            <Download className="w-4 h-4 stroke-[2.5px]" />
            Download README.md
          </button>
        </div>
      </div>

      {/* Selector tab bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Main workspace showing results */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-none p-6 sm:p-8 shadow-2xl relative min-h-[600px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Emulated GitHub Preview Page</span>
            </div>

            <div className="flex bg-black/40 border border-white/10 p-1.5 rounded-none">
              <button
                onClick={() => setTabMode("visual")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer transition ${tabMode === "visual" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Visual Live
              </button>
              <button
                onClick={() => setTabMode("raw")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer transition ${tabMode === "raw" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Raw Source
              </button>
            </div>
          </div>

          {tabMode === "visual" ? (
            <div className="text-left select-none max-h-[700px] overflow-y-auto pr-2">
              {renderSimulatedHtmlOutput()}
            </div>
          ) : (
            <textarea
              readOnly
              value={markdownContent}
              className="w-full h-[600px] bg-black/40 border border-white/10 rounded-none p-4 text-xs font-mono text-white/60 focus:outline-none resize-none"
            />
          )}
        </div>

        {/* Right side helper info column */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-none p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2 text-brand-orange pb-3 border-b border-white/5">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Mounting Blueprint Instructions</span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Follow these exact steps to activate this premium resume layout directly inside your GitHub repository profile:
          </p>

          <ol className="space-y-4 text-xs text-white/80">
            <li className="bg-black/40 p-4 rounded-none border border-white/5">
              <div className="font-extrabold uppercase tracking-wide text-brand-orange mb-1">1. Special Repository</div>
              Create a new public repository on GitHub where the name absolutely matches your username (e.g. <b className="text-white font-mono break-all font-bold">github.com/{order.readmeData.githubUsername}/{order.readmeData.githubUsername}</b>).
            </li>
            <li className="bg-black/40 p-4 rounded-none border border-white/5">
              <div className="font-extrabold uppercase tracking-wide text-brand-orange mb-1">2. Add README.md file</div>
              In that new repository, edit the file named <b className="text-white font-mono font-bold">README.md</b>. Paste the copied markdown code directly inside it.
            </li>
            <li className="bg-black/40 p-4 rounded-none border border-white/5">
              <div className="font-extrabold uppercase tracking-wide text-brand-orange mb-1">3. Commit & Save</div>
              Commit your modifications to your master/main branch. The portfolio will render instantly on your public index profile!
            </li>
          </ol>

          <div className="bg-white/5 border border-white/10 text-[#F5F5F5]/80 p-4 rounded-none text-xs flex items-start gap-2.5 leading-relaxed font-sans font-medium">
            <Terminal className="w-4.5 h-4.5 text-brand-orange shrink-0 mt-0.5" />
            <span>
              All badges, streak panels, contribution graphs, and level bars verify globally in real time using responsive endpoints. No client setups required.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
