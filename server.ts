import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiInstance;
}

// ==========================================
// REST APIs (Modular Controllers)
// ==========================================

// 1. Video Idea Generator
app.post("/api/ai/ideas", async (req, res) => {
  const { topic, tone, format } = req.body;
  const prompt = `Generate 5 video ideas for a YouTube creator on the topic: "${topic}". Tone should be "${tone || "engaging"}". Format: "${format || "all"}". Give viral-focused ideas, complete with an engaging title, hook, target audience, viral potential score (70-100), competition level (Low/Medium/High), engagement rating (Outstanding/Very High/High/Steady), and type (Shorts/Long Form).`;

  const ai = getGemini();
  if (!ai) {
    // Return high quality simulated ideas if key is missing
    const simIdeas = [
      {
        title: `I Tried the Ultimate 30-Day "${topic}" Challenge (And Failed?)`,
        hook: `I spent 720 hours doing nothing but this, and here is exactly what it did to my life.`,
        targetAudience: `Tech enthusiasts and productivity learners`,
        viralPotential: 94,
        competition: "Medium",
        engagementRating: "Outstanding",
        type: "Long Form"
      },
      {
        title: `The Lie About "${topic}" That Everyone Believes! 🛑`,
        hook: `You've been told to do this since day one, but secret data reveals why it's actually ruinous.`,
        targetAudience: `Curious beginners and skeptical searchers`,
        viralPotential: 89,
        competition: "Low",
        engagementRating: "Very High",
        type: "Long Form"
      },
      {
        title: `How "${topic}" Actually Works in 2026 (60-sec Guide)`,
        hook: `Stop scrolling! This 1-minute secret is the only thing standing between you and mastery.`,
        targetAudience: `Fast-paced mobile viewers looking for shortcuts`,
        viralPotential: 97,
        competition: "High",
        engagementRating: "Outstanding",
        type: "Shorts"
      },
      {
        title: `5 Forbidden Tools for "${topic}" Mastery`,
        hook: `Most gurus hide these tools to sell their courses, but I'm exposing them for free.`,
        targetAudience: `Optimizers and growth-focused creators`,
        viralPotential: 91,
        competition: "Low",
        engagementRating: "Very High",
        type: "Long Form"
      },
      {
        title: `This Single "${topic}" Mistake is Killing Your Channel...`,
        hook: `Look at this retention chart. The exact drop-off happens because of this one error.`,
        targetAudience: `Active YouTube content creators`,
        viralPotential: 86,
        competition: "Low",
        engagementRating: "Steady",
        type: "Shorts"
      }
    ];
    return res.json({ ideas: simIdeas, simulated: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["ideas"],
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "hook", "targetAudience", "viralPotential", "competition", "engagementRating", "type"],
                properties: {
                  title: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  targetAudience: { type: Type.STRING },
                  viralPotential: { type: Type.INTEGER },
                  competition: { type: Type.STRING },
                  engagementRating: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ ideas: parsed.ideas || [], simulated: false });
  } catch (error: any) {
    console.error("Gemini Idea Gen Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 2. SEO Optimizer
app.post("/api/ai/seo", async (req, res) => {
  const { title, keywords } = req.body;
  const prompt = `Optimize YouTube SEO for a video related to: "${title}". Target secondary keywords: "${keywords}". Provide exactly 3 optimized premium titles, a highly description-rich template, a list of 10 targeted tags, 5 core keywords, 3 hashtags, an overall SEO Score out of 100, custom Competition Assessment (Low/Medium/High), and Search Visibility analysis comment.`;

  const ai = getGemini();
  if (!ai) {
    const simSEO = {
      titles: [
        `🚀 Master ${title || "This Tech"} in 2026: The Ultimate Complete Guide`,
        `How I Broke the ${title || "Tech"} Algorithm (Step-by-Step)`,
        `STOP Using ${title || "Standard Methods"}! Do This Instead`
      ],
      description: `Want to master ${title || "this topic"} quickly? This video covers the full secrets, shortcuts, and core frameworks you need to accelerate your results.\n\nTIMESTAMPS:\n0:00 - Introduction\n1:45 - The Big Mistake\n4:12 - Blueprint Breakdown\n8:30 - Next Action Steps\n\nMake sure to subscribe for more premium growth tutorials!`,
      tags: ["tutorial", "optimization", "growth", "masterclass", "digital assets", "how to grow", "viral secrets"],
      keywords: ["secrets", "algorithm", "tutorial", "guide", "2026 update"],
      hashtags: ["#growonline", `#${(title || "learning").toLowerCase().replace(/\s+/g, "")}`, "#algorithm"],
      seoScore: 92,
      competition: "Medium",
      searchVisibility: "High Search Volume, Steady Growth Trend"
    };
    return res.json({ report: simSEO, simulated: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["titles", "description", "tags", "keywords", "hashtags", "seoScore", "competition", "searchVisibility"],
          properties: {
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoScore: { type: Type.INTEGER },
            competition: { type: Type.STRING },
            searchVisibility: { type: Type.STRING }
          }
        }
      }
    });

    const report = JSON.parse(response.text?.trim() || "{}");
    return res.json({ report, simulated: false });
  } catch (error: any) {
    console.error("Gemini SEO Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Script Generator
app.post("/api/ai/script", async (req, res) => {
  const { title, scriptType, duration } = req.body;
  const prompt = `Write a professional, dramatic, and high-retention YouTube video script for title: "${title}". Type: "${scriptType || "Storytelling"}". Target Duration: "${duration || "5 minutes"}". Format and return exactly as a structural storytelling layout containing intro, main body segments, and visual hook notations. Use markdown annotations.`;

  const ai = getGemini();
  if (!ai) {
    const simScript = `## TITLE: ${title || "The Unspoken Code of Success"}
**Duration**: ${duration || "5 Minutes"} | **Format**: ${scriptType || "Viral Storytelling"}

---

### [0:00 - 0:15] THE EYE-CATCHING COLD OPEN
*(Visual: Rapid cuts of retention-optimized B-Roll showing real creators failing at their analytics chart. A dynamic zoom onto the speaker's eyes.)*

**HOST (Inherent energy, direct address)**:  
"What if I told you that 99% of your growth slowdown isn't your thumbnail... isn't your niche... and isn't the algorithm? There is a silent error you are repeating every single upload, and in exactly four minutes, I'm going to prove it."

---

### [0:15 - 1:30] SECTION 1: THE RETENTION ILLUSION
*(Visual: Highlight graphs plotting average viewer drop-offs. Emphasize a red flatline where subscribers swipe away.)*

**HOST**:  
"Look at this graph. This is where most channels perish. They spent ten hours scriptwriting, but didn't hook their audience's psychological trigger in the first seven seconds. Here is how we reverse that forever..."

---

### [1:30 - 3:30] SECTION 2: THE MULTI-TIER FORMULA
*(Visual: Step-by-step whiteboard diagram highlighting: Hook &rarr; Agitation &rarr; Solution &rarr; Resolution.)*

**HOST**:  
"Every major creator runs this exact system. First, agitate the core problem. If we do not make the viewer feel the pressure of lost views, they have no reason to stay. Next, deliver tactical, instant payoffs."

---

### [3:30 - END] THE FINAL TRANSITIONAL CALL-TO-ACTION
*(Visual: Seamless motion transitions showing subscriber metrics expanding exponentially. Sound effect: Soft click chime.)*

**HOST**:  
"Now that you've got this blueprint, you are ready to dominate. But do not make the mistake of leaving without planning your upload sequence. Click the Content Calendar tab right now, schedule your outline, and let's win."`;

    return res.json({ script: simScript, simulated: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class YouTube script doctor. Write deep, structured scripts with visual queues, sound effect indicators, and speaker lines.",
      }
    });

    return res.json({ script: response.text, simulated: false });
  } catch (error: any) {
    console.error("Gemini Script Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Viral Score Analyzer
app.post("/api/ai/viral-score", async (req, res) => {
  const { title, category } = req.body;
  const prompt = `Analyze the viral potential of this YouTube video title concept: "${title}". Category: "${category || "Education"}". Provide exactly a viralScore (0-100), competition level ("High", "Medium", "Low"), engagementPotential ("Extreme", "Very High", "Healthy", "Steady"), list of 3 Pros (highlights), 3 Cons (weaknesses), and 3 quick Action Steps to implement immediately to raise the clickability.`;

  const ai = getGemini();
  if (!ai) {
    const score = Math.floor(Math.random() * 25) + 70; // 70 to 95
    simulatedReport: {
      const report = {
        title: title || "Untitled Blueprint",
        viralScore: score,
        competition: "Medium",
        engagementPotential: "Very High",
        pros: [
          "Curiosity gap is well established in the core phrasing.",
          "Short and extremely readable in mobile YouTube feed layouts.",
          "Leverages current high-intent emotional triggers."
        ],
        cons: [
          "Competition for similar niches is saturated at this exact hour.",
          "Lacks a strong personalized identifier.",
          "Passive voice slightly dilutes immediate action."
        ],
        suggestions: [
          "Add brackets with numbers, e.g. [New 2026 Rules] to create structural urgency.",
          "Add punchy verbs to start the title, e.g., 'Exposing...' or 'Destroying...'.",
          "Match the thumbnail color palette strictly with high-contrast neon reds or yellows."
        ]
      };
      return res.json({ report, simulated: true });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["viralScore", "competition", "engagementPotential", "pros", "cons", "suggestions"],
          properties: {
            viralScore: { type: Type.INTEGER },
            competition: { type: Type.STRING },
            engagementPotential: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const report = JSON.parse(response.text?.trim() || "{}");
    report.title = title || "Untitled Concept";
    return res.json({ report, simulated: false });
  } catch (error: any) {
    console.error("Gemini Viral Score Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. Thumbnail Analyzer
app.post("/api/ai/thumbnail-analysis", async (req, res) => {
  const { title, captionText } = req.body;
  
  // Real or mock visual analyze
  const prompt = `Analyze a simulated YouTube thumbnail overlay for a video: "${title}". On-screen caption text: "${captionText || "No text"}". Give exactly a score (0-100), prediction of CTR ("Excellent", "Above Average", "Average", "Attention Required"), Contrast level comment, Reading ease comment, Face positioning recommendations, and 3 explicit thumb optimization advice bullet points.`;

  const ai = getGemini();
  if (!ai) {
    const report = {
      score: 87,
      ctrPotential: "Above Average (Estimated: 6.8% - 8.2%)",
      contrast: "Extreme high contrast. The yellow text on the charcoal background populates beautifully.",
      readability: "Perfect. 3-word rule is respected, avoiding desktop search clipping.",
      facePosition: "Placing your expressive visual reaction on the far right prevents the YouTube timestamp overlay from blocking your face.",
      suggestions: [
        "Increase the outer glow offset around the foreground subject by 10% to add a layered 3D depth.",
        "Ensure the facial expression shows high agitation or wide-eyed curiosity, which increases micro-click rates by 22%.",
        "Keep the text caption exactly short (maximum 3 words) with clean sans-serif display fonts."
      ]
    };
    return res.json({ report, simulated: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "ctrPotential", "contrast", "readability", "facePosition", "suggestions"],
          properties: {
            score: { type: Type.INTEGER },
            ctrPotential: { type: Type.STRING },
            contrast: { type: Type.STRING },
            readability: { type: Type.STRING },
            facePosition: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const report = JSON.parse(response.text?.trim() || "{}");
    return res.json({ report, simulated: false });
  } catch (error: any) {
    console.error("Gemini Thumbnail Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 6. AI Coach Chat / Channel Reviewer
app.post("/api/ai/coach", async (req, res) => {
  const { history } = req.body; // Array of { role: 'user'|'model', text: string }

  const systemInstruction = 
    "You are 'Growth Coach Pro', an expert YouTube Channel Executive, Growth Strategist, and monetization specialist. " +
    "You speak in a tactical, motivational, and extremely direct tone (comparable to elite business coaches). " +
    "Always provide actionable monetization suggestions, video editing hooks, SEO tweaks, and creator tips. " +
    "Be brief (under 120 words per response), structure list formatting when helpful, and maintain elite professional SaaS status.";

  const ai = getGemini();
  if (!ai) {
    // Return high quality responses from Coach offline
    const lastUserMsg = history[history.length - 1]?.text || "";
    let reply = "Your YouTube growth plan looking solid, creator! Connect with actual settings and configure your calendar for maximum optimization. Let's keep consistency going!";
    if (lastUserMsg.toLowerCase().includes("monetization") || lastUserMsg.toLowerCase().includes("money")) {
      reply = "💰 **Monetization Blueprint for YouTube Growth AI Pro:**\n1. **Digital Deliverables**: Immediately link a Gumroad guide in pinned comments.\n2. **Strategic Sponsors**: Charge standard CPM rates ($25-$40) once you hit 5K. Pitch brands on 30s cold integrations.\n3. **Viewer Memberships**: Build a monthly community tier for behind-the-scenes assets.";
    } else if (lastUserMsg.toLowerCase().includes("idea") || lastUserMsg.toLowerCase().includes("video")) {
      reply = "🎬 **Critical Content Tweaks:**\n- **The 3-Second rule**: Hook your viewer with a shocking statistic or question, never start with standard logos.\n- **Pacing Shifts**: Change visual focus or insert zoom chimes every 4 seconds to force high retention stats.";
    } else if (lastUserMsg.toLowerCase().includes("seo") || lastUserMsg.toLowerCase().includes("traffic")) {
      reply = "📈 **SEO Authority Roadmap:**\n- Target 'Long Tail' keywords first (phrases with 4+ words).\n- Match search intent strictly in your description line 1. That's the only line the indexing spiders prioritize pre-click.";
    }
    return res.json({ reply, simulated: true });
  }

  try {
    const formattedContents = history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    return res.json({ reply: response.text, simulated: false });
  } catch (error: any) {
    console.error("Gemini Coach Chat Error:", error);
    return res.status(500).json({ reply: `An err occurred: ${error.message}. Switch back to simulation fallback.` });
  }
});

// ==========================================
// Vite Middleware & Production Routing
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static server mounted for path:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YouTube Growth AI Pro full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
