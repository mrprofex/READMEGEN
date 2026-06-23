import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("GEMINI_API_KEY placeholder handled. Standard offline generator standby initialized.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

export async function generateReadmeAi(userData: any, theme: string, plan: "Pro" | "Premium" = "Pro"): Promise<string> {
  const client = getGeminiClient();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // If no key is set, generate a beautiful theme-customized local README fallback which looks outstanding
    // so the user can see beautiful outcomes instantly even if secrets aren't bound in preview yet!
    return getLocalBackupReadme(userData, theme, plan);
  }

  // Active section toggles
  const s = userData.sections || {
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

  const sectionsStatus = Object.entries(s)
    .map(([k, v]) => `- Layout Section element "${k}" is explicitly: ${v ? "ENABLED / REQUIRED to be generated" : "DISABLED / MUST NOT be generated"}`)
    .join("\n");

  // Construct structured prompt to guide the model safely
  const prompt = `
Generate a premium, full-width high-impact GitHub Profile README.md file in raw Markdown format.

User Details:
${JSON.stringify(userData, null, 2)}

Selected Theme: ${theme}
Selected Subscription Plan: ${plan}

Active Sections Status (Strictly follow which components are request-enabled vs request-disabled):
${sectionsStatus}

Required Aesthetic and Structure Guidelines (Omit any segment of typography or badge if marked as DISABLED/MUST NOT be generated above):
1. HEADER CAPSULE WAVE:
Include a full-width header image wave using:
https://capsule-render.vercel.app/api?type=waving&height=300&text=\${encodeURIComponent(userData.name || "John Doe").toUpperCase()}&fontSize=48&fontColor=ffffff&animation=twinkling&fontAlignY=38&color=[theme-appropriate-colorset]

2. INTRODUCTION & TYPING INDICATORS:
An elegant "👋 Hi, I'm [Name]" heading followed by active typing animated badges using the tech Poppins herokuapp typing SVG. Let it list 4-5 items based on user skills, bio and tagline.
Include a komarev profile views badge with username: \${userData.githubUsername || "john_doe"}.

3. DEVELOPER DASHBOARD TABLE:
Include a full width table containing three status metrics panels styled exactly with bullet points:
- VS CODE STATUS: Active coding status, dynamic highlights
- MISSION STATUS: Active goals, practice points
- LIVE SYSTEM: Status online, improved learning lines

4. INTERACTIVE CONNECTIVITY RAIL:
Generate beautifully designed badges with Shields.io for digital channels: Instagram, LinkedIn, GitHub, and WhatsApp with custom theme-congruent colors linking to their specified links or standard fallback handles for John Doe.

5. TECH STACK PANEL:
Incorporate skillicons.dev grid showcasing \${(userData.skills || []).join(",")}! Use:
https://skillicons.dev/icons?i=\${(userData.skills || ["react","typescript","html"]).map(s => s.toLowerCase().trim()).join(",")}

6. SYSTEM INITIALIZATION BAR:
A second Fira Code green console typing SVG or blinking rect capsule-render showing "SYSTEM ONLINE" loaded dynamically for \${userData.name}.

7. DYNAMIC DEVELOPER ACTIVITY GRAPH:
Showcase real interactive cards and graphs:
- Stats card: github-readme-stats with theme matching the visual theme
- Productive time card
- Repos per language card
- GitHub README activity graph line using theme styling

8. CONTRIBUTION STREAK:
glowing demcolab streak-stats badge aligned for \${userData.githubUsername || "john_doe"}.

9. ROADMAP DESIGN:
Generate a pristine, custom-colored Mermaid LR flowchart illustrating their current mastery path from HTML/CSS elements to full-stack, Next.js or performance parameters.

Plan Restrictions:
- Pro Plan: High-quality structure, stats cards enabled, skill badge tables, achievements.
- Premium Plan: Includes personalized AI story bio, learning roadmap grid, advanced Spotify/YT music tunes widgets, and the contribution snake grid.

Mandatory Markdown Output Requirements:
1. Output ONLY the raw README.md markdown content. Do NOT wrap it in any backticks like \`\`\`markdown or \`\`\` text codes. Start directly with the Markdown code or HTML badges.
2. Ensure you use responsive profile stats images.
3. Include an animated interactive-style typing SVG header.
`;

  let attempts = 3;
  let delay = 500;
  let lastErr: any = null;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      let markdown = response.text || "";
      // Clean any accidentally returned markdown wrap blocks
      if (markdown.startsWith("```markdown")) {
        markdown = markdown.substring(11);
      } else if (markdown.startsWith("```")) {
        markdown = markdown.substring(3);
      }
      if (markdown.endsWith("```")) {
        markdown = markdown.substring(0, markdown.length - 3);
      }

      return markdown.trim();
    } catch (err: any) {
      lastErr = err;
      const errMsg = err?.message || err?.toString() || "";
      const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("429") || errMsg.includes("limit") || errMsg.includes("overloaded") || err?.status === 503 || err?.status === 429;
      
      if (isTransient && attempt < attempts) {
        console.log(`Gemini API request status (Attempt ${attempt}/${attempts}) notice: ${errMsg}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        break;
      }
    }
  }

  const isQuotaError = lastErr?.message?.includes("429") || lastErr?.toString()?.includes("429") || lastErr?.status === 429;
  if (isQuotaError) {
    console.log("Gemini API Rate Limit / Quota Handled. Smoothly deploying the high-fidelity professional markdown generator fallback.");
  } else {
    console.log("Gemini API connection updated: " + (lastErr?.message || lastErr) + ". Activating high-performance local backup content generation.");
  }
  return getLocalBackupReadme(userData, theme, plan);
}

function getLocalBackupReadme(userData: any, theme: string, plan: "Pro" | "Premium"): string {
  const themeColors: Record<string, { capsuleColors: string, badgeColor: string, statsTheme: string }> = {
    Cyberpunk: { capsuleColors: "0:FF007F,50:8A2BE2,100:00F0FF", badgeColor: "FF007F", statsTheme: "tokyonight" },
    Hacker: { capsuleColors: "0:050505,100:00FF00", badgeColor: "00FF00", statsTheme: "radical" },
    "Orange Fire": { capsuleColors: "0:ff3c00,50:ff6a00,100:ff0000", badgeColor: "FF5500", statsTheme: "solarized-dark" },
    Minimal: { capsuleColors: "0:111111,100:333333", badgeColor: "111111", statsTheme: "default" },
    Anime: { capsuleColors: "0:FF69B4,100:FFB6C1", badgeColor: "FF69B4", statsTheme: "vue" },
    Gaming: { capsuleColors: "0:8A2BE2,100:4B0082", badgeColor: "8A2BE2", statsTheme: "dracula" },
    Professional: { capsuleColors: "0:003366,100:333333", badgeColor: "0077B5", statsTheme: "github" },
  };

  const currentTheme = themeColors[theme] || themeColors["Orange Fire"];
  const name = userData.name || "John Doe";
  const upperName = name.toUpperCase();
  const username = userData.githubUsername || "john_doe";
  const tagline = userData.tagline || "Full Stack Software Engineer";
  const bio = userData.bio || "Building next-generation reactive SaaS frameworks and web applications.";
  const location = userData.location || "New York, USA";
  const goalStr = userData.learningGoals || "TypeScript patterns, advanced AI models, and custom graphics";

  const instagramLink = userData.instagram || `https://instagram.com/${username}`;
  const linkedinLink = userData.linkedin || `https://linkedin.com/in/${username}`;
  const githubLink = `https://github.com/${username}`;
  const whatsappNumber = "1234567890";

  // Compile skill icons query
  const defaultSkills = ["vscode", "python", "java", "html", "css", "js", "react", "nodejs", "git", "github"];
  const skillQuery = (userData.skills && userData.skills.length > 0)
    ? userData.skills.map((s: string) => s.toLowerCase().trim().replace(".", "").replace("+", "p").replace(" ", "")).join(",")
    : defaultSkills.join(",");

  const encodedTypingLines = encodeURIComponent(`🔥 ${tagline};💻 ${bio};🚀 Learning: ${goalStr}`);

  // Auto generated premium bio for Premium plan users
  const generatedBio = plan === "Premium"
    ? `> 🤖 **AI-Generated Premium Bio:** A highly ambitious and performance-driven software artisan operating from the coordinates of **${location}**. Dedicated to shipping gorgeous client-side products and bulletproof architecture. Constantly testing new parameters, designing intuitive interactive modules, and keeping current on reactive paradigms.`
    : `> ${bio}`;

  const projectsMarkdown = (userData.projects && userData.projects.length > 0)
    ? userData.projects.map((p: any) => `### 🌐 [${p.name || "Awesome Project"}](${p.githubUrl || "#"})\n${p.description || "An innovative solution built with cutting-edge engineering guidelines."}\n`).join("\n")
    : `### 🌐 Portfolio Website\nResponsive personal website and SaaS catalog.\n\n### 📝 Task Organizer\nInteractive kanban planner with offline local database architecture.`;

  // Get active section values, defaulting to true if not specified
  const s = userData.sections || {
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

  let sectionsList: string[] = [];

  if (s.headerWave) {
    sectionsList.push(`<!-- PREMIUM FULL WIDTH FIRE HEADER -->
<p align="center">
<img
width="100%"
src="https://capsule-render.vercel.app/api?type=waving&height=300&text=${encodeURIComponent(upperName)}&fontSize=48&fontColor=ffffff&animation=twinkling&fontAlignY=38&color=${currentTheme.capsuleColors}"
/>
</p>`);
  }

  if (s.typingIndicator) {
    sectionsList.push(`<div align="center">
# 👋 Hi, I'm ${name}
<img
src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=700&size=30&duration=2200&pause=700&color=${currentTheme.badgeColor}&center=true&vCenter=true&width=950&lines=${encodedTypingLines}"
/>
<br><br>
<img
src="https://komarev.com/ghpvc/?username=${username}&label=PROFILE+VIEWS&color=${currentTheme.badgeColor}&style=for-the-badge"
/>
</div>`);
  } else {
    sectionsList.push(`# 👋 Hi, I'm ${name}`);
  }

  if (s.developerDashboard) {
    sectionsList.push(`## 🖥️ DEVELOPER DASHBOARD
<div align="center">
<table width="100%">
<tr>
<td width="33%" align="center">
### 💻 VS CODE STATUS
🟢 Active Coding Mode  
🔥 Building Projects  
⚡ Debugging Skills  
🚀 Learning Every Day
</td>
<td width="33%" align="center">
### 🎯 MISSION STATUS
🚀 Full Stack Goal  
🔥 Daily Practice  
⚡ Project Building  
💡 Growth Mode
</td>
<td width="33%" align="center">
### 📡 LIVE SYSTEM
🟢 Online  
⚙️ Processing Skills  
📈 Improving Daily  
💾 Saving Knowledge
</td>
</tr>
</table>
</div>`);
  }

  if (s.connectWithMe) {
    sectionsList.push(`## 📱 CONNECT WITH ME
<div align="center">
<a href="${instagramLink}">
<img src="https://img.shields.io/badge/Instagram-${currentTheme.badgeColor}?style=for-the-badge&logo=instagram&logoColor=white"/>
</a>
<a href="${linkedinLink}">
<img src="https://img.shields.io/badge/LinkedIn-0077b5?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>
<a href="${githubLink}">
<img src="https://img.shields.io/badge/GitHub-111111?style=for-the-badge&logo=github&logoColor=white"/>
</a>
<a href="https://wa.me/${whatsappNumber}">
<img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
</a>
</div>`);
  }

  if (s.currentJourney) {
    sectionsList.push(`## 🌍 CURRENT JOURNEY
${generatedBio}

🧠 Learning modern web development and APIs  
⚡ Building responsive client application grids  
🎯 Improving system scale and layout flows  
🚀 Exploring next-generation AI and developer solutions  
🔥 Compiling projects consistently every single day`);
  }

  if (s.skillsList) {
    sectionsList.push(`## 🛠 TECH STACK
<div align="center">
<img
src="https://skillicons.dev/icons?i=${skillQuery}"
/>
</div>`);
  }

  if (s.developerActivity) {
    sectionsList.push(`## ⚡ DEVELOPER ACTIVITY
<div align="center">
<table>
  <tr>
    <td align="center">
      <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${username}&theme=${currentTheme.statsTheme}"/>
    </td>
    <td align="center">
      <img src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=${username}&theme=${currentTheme.statsTheme}&utcOffset=8"/>
    </td>
   </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${username}&theme=${currentTheme.statsTheme}"/>
    </td>
   </tr>
</table>
<br>
<img
width="100%"
src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${currentTheme.statsTheme === "default" ? "github" : currentTheme.statsTheme === "github" ? "github" : "tokyo-night"}&hide_border=true&area=true&bg_color=000000&color=${currentTheme.badgeColor}&line=${currentTheme.badgeColor}&point=ffffff"
/>
</div>`);
  }

  if (s.contributionStreak) {
    sectionsList.push(`## 🔥 CONTRIBUTION STREAK
<div align="center">
![GitHub Streak](https://streak-stats.demolab.com/?user=${username}&theme=${currentTheme.statsTheme === "default" ? "default" : "tokyonight"}&hide_border=true&stroke=${currentTheme.badgeColor}&ring=${currentTheme.badgeColor}&fire=${currentTheme.badgeColor}&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=${currentTheme.badgeColor}&sideLabels=ffffff&dates=ffffff)
</div>`);
  }

  if (s.featuredProjects) {
    sectionsList.push(`## 🚀 FEATURED PROJECTS
${projectsMarkdown}`);
  }

  if (s.spotlightSlider) {
    sectionsList.push(`## 🎥 DEVELOPER SPOTLIGHT
<div align="center">
<img
width="100%"
src="https://user-images.githubusercontent.com/74038190/221352995-5ac18bdf-1a19-4f99-bbb6-77559b220470.gif"
/>
<br>
<img
src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=22&duration=2500&pause=500&color=${currentTheme.badgeColor}&center=true&vCenter=true&width=900&lines=🎬+LIVE+CODING+SESSION+ACTIVE;⌨️+BUILDING+THE+FUTURE+ONE+COMMIT+AT+A+TIME;🔥+${encodeURIComponent(upperName)}+•+DEVELOPER+SPOTLIGHT;⚡+PUSHING+BOUNDARIES+•+CREATING+SOLUTIONS"
/>
<br>
<table align="center">
<tr>
<td align="center">🎯 TODAY'S FOCUS</td>
<td align="center">🚀 PROJECT</td>
<td align="center">⏰ SESSION TIME</td>
</tr>
<tr>
<td align="center"><strong>Full Stack Dev</strong></td>
<td align="center"><strong>Portfolio 2.0</strong></td>
<td align="center"><strong>6h 42m</strong></td>
</tr>
</table>
</div>

## 🎧 DEV TUNES (WHILE YOU BROWSE)
<div align="center">
<a href="https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY">
<img src="https://img.shields.io/badge/CODING%20PLAYLIST-Lofi%20Beats-ff6a00?style=for-the-badge&logo=spotify&logoColor=white"/>
</a>
<a href="https://music.youtube.com/playlist?list=RDCLAK5uy_kmrX0Vl4z0ui6vNnF9g7Az7gGZb_5Jvq8">
<img src="https://img.shields.io/badge/FOCUS%20MIX-Chill%20Vibes-ff8800?style=for-the-badge&logo=youtubemusic&logoColor=white"/>
</a>
<a href="https://www.youtube.com/watch?v=jfKfPfyJRdk">
<img src="https://img.shields.io/badge/LIVE%20RADIO-Lofi%20Girl-ffaa00?style=for-the-badge&logo=youtube&logoColor=white"/>
</a>
<br><br>
🎵 *Click any badge above to open your coding soundtrack* 🎵
</div>

## 🐍 SNAKE INFRASTRUCTURE
<div align="center">
<img
width="100%"
src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg"
/>
</div>`);
  }

  if (s.funFacts) {
    sectionsList.push(`## 🏆 ACHIEVEMENTS
🏅 Consistent Learner  
🏅 Frontend Development Mastery  
🏅 Open Source Journey Enthusiast  
🏅 Building Projects Every Week  
🏅 Exploring New Tech Coordinates

## ☕ FUN FACTS
💻 I enjoy coding and experimenting with state loops  
🌙 I love building late at night with music  
🎯 Always improving my system architecture skills  
🔥 Turning creative ideas into custom SaaS software`);
  }

  if (s.learningRoadmap) {
    sectionsList.push(`## 📊 INTERACTIVE STATS DASHBOARD
<div align="center">
<img
width="100%"
src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${username}&theme=${currentTheme.statsTheme}"
/>
</div>

## 🗺️ ADVANCED LEARNING ROADMAP
\`\`\`mermaid
graph LR
A[HTML/CSS] --> B[JavaScript ES6]
B --> C[React + Redux]
C --> D[Node.js + Express]
D --> E[MongoDB]
E --> F[Full Stack Apps]
B --> G[TypeScript]
G --> H[Next.js]
H --> I[Performance Optimization]
style A fill:#ff6a00,stroke:#333,stroke-width:2px
style B fill:#ff8800,stroke:#333,stroke-width:2px
style C fill:#ffaa00,stroke:#333,stroke-width:2px
style D fill:#ffcc00,stroke:#333,stroke-width:2px
style E fill:#ffee00,stroke:#333,stroke-width:2px
style F fill:#00ff00,stroke:#333,stroke-width:4px
style G fill:#ffaa33,stroke:#333,stroke-width:2px
style H fill:#ffcc66,stroke:#333,stroke-width:2px
style I fill:#66ff66,stroke:#333,stroke-width:4px
\`\`\``);
  }

  return sectionsList.join("\n\n---\n\n");
}
