// Mock AI Response Database for dynamic YouTube Ideas, SEO and Scripting.

export interface NicheData {
  ideas: {
    title: string;
    hook: string;
    targetAudience: string;
    viralPotential: number;
    competition: 'Low' | 'Medium' | 'High';
    engagementRating: 'Outstanding' | 'Very High' | 'High' | 'Steady';
  }[];
  scripts: {
    shorts: {
      hook: string;
      body: string;
      cta: string;
    };
    long: {
      intro: string;
      point1: string;
      point2: string;
      point3: string;
      outro: string;
    };
  };
}

export const POPULAR_NICHEs = [
  { id: 'tech', name: '💻 Technology & Coding' },
  { id: 'gaming', name: '🎮 Gaming & Esports' },
  { id: 'finance', name: '🪙 Personal Finance & Crypto' },
  { id: 'fitness', name: '💪 Fitness, Health & Diet' },
  { id: 'cooking', name: '🍳 Cooking & Food Recipes' },
  { id: 'travel', name: '✈️ Travel & Adventure Vlogs' },
  { id: 'lifestyle', name: '✨ Lifestyle, Design & Productivity' },
];

export const MOCK_NICHE_DATABASE: Record<string, NicheData> = {
  tech: {
    ideas: [
      {
        title: "I Built a Full App in 10 Minutes with this NEW AI Tool!",
        hook: "Most developers think building an app takes months. But look at this...",
        targetAudience: "Junior developers, tech enthusiasts, side-hustlers",
        viralPotential: 96,
        competition: "Medium",
        engagementRating: "Outstanding"
      },
      {
        title: "ChatGPT's Secret Features Nobody is Using (2026 Developer Edition)",
        hook: "If you are only using ChatGPT for basic text, you are missing 90% of its power.",
        targetAudience: "Students, professionals, programmers",
        viralPotential: 92,
        competition: "High",
        engagementRating: "Very High"
      },
      {
        title: "Is this $500 'AI Wearable' Actually Worth the Hype?",
        hook: "I spent 30 days wearing this AI pin so you don't have to.",
        targetAudience: "Gadget lovers, early adopters",
        viralPotential: 89,
        competition: "Low",
        engagementRating: "Outstanding"
      },
      {
        title: "How I'd Learn Coding from Scratch in 2026 (No Degree needed)",
        hook: "If I woke up tomorrow with zero coding skills, this is the exact 3-step roadmap I would use.",
        targetAudience: "Beginner coders, career switchers",
        viralPotential: 95,
        competition: "Medium",
        engagementRating: "Outstanding"
      }
    ],
    scripts: {
      shorts: {
        hook: "🛑 STOP wasting months trying to learn programming the old way!",
        body: "In 2026, those 80-hour bootcamp videos are obsolete. Instead, use the 3-Step Project Method. Step 1: Pick one simple app idea, like a YouTube generator. Step 2: Use AI prompting to build the starter code. Step 3: Delete 10% of the code and rewrite it manually to understand why it worked.",
        cta: "Hit follow for more game-changing software tips every single day!"
      },
      long: {
        intro: "Hey everyone! Today, we are breaking down the absolute fastest path to master coding from scratch. The industry has shifted entirely, and traditional advice is setting you up for failure. Let's reveal the real 2026 roadmap.",
        point1: "The Prompt-First Mindset: Learn logic first, syntax second. AI acts as your compiler; you act as the architect of the system design flow.",
        point2: "Surgical Rebuilding: Take AI-generated code blocks apart. Force break-points into them and learn how to debug failures. That is where real muscle-memory forms.",
        point3: "Building Public Portfolio: Publish real micro-SaaS widgets or tools on GitHub and demo them on video. Reaching actual users beats any certificate.",
        outro: "If this roadmap made sense, hit the like button. Let me know in the comments: what is the first micro-app you are planning to build?"
      }
    }
  },
  gaming: {
    ideas: [
      {
        title: "The Impossible Challenge That Shocked the Gaming Community!",
        hook: "Only 0.01% of gamers have ever completed this level, but we did it with a twist...",
        targetAudience: "Hardcore gamers, stream viewers",
        viralPotential: 98,
        competition: "High",
        engagementRating: "Outstanding"
      },
      {
        title: "I Spent 100 Hours in the Ultimate Realistic Sandbox Game!",
        hook: "From building empires to watching them fully collapse in seconds...",
        targetAudience: "Sandbox lovers, strategy enthusiasts",
        viralPotential: 91,
        competition: "Medium",
        engagementRating: "Very High"
      },
      {
        title: "10 Secret Easter Eggs in the Newest RPG Update",
        hook: "You probably missed these hidden locations, but they completely change the lore.",
        targetAudience: "RPG gamers, lore theorists",
        viralPotential: 87,
        competition: "Low",
        engagementRating: "High"
      }
    ],
    scripts: {
      shorts: {
        hook: "This one gaming secret will completely change how you play!",
        body: "Did you know that in the newest update, devs hid a secret weapon right in the starting zone? You just need to trigger three hidden panels in absolute silent succession. It multiplies your damage outputs by five!",
        cta: "Tag a friend who always loses, and hit subscribe!"
      },
      long: {
        intro: "Welcome back! Today we are diving deep into the absolute craziest challenge ever recorded in gaming history. Millions of attempts, countless rage quits, and one final crazy breakthrough.",
        point1: "Setting up the Stage: The constraints we used, including no-damage indicators and a strict timer.",
        point2: "The Critical Failure: Analyzing the micro-errors that blew up our first 86 attempts.",
        point3: "The Perfect Execution: The unique movement exploit that made the final boss battle a complete breeze.",
        outro: "Would you try this playstyle yourself? Leave a comment and subscribe for more insane gaming experiments!"
      }
    }
  },
  finance: {
    ideas: [
      {
        title: "The Smartest Place to Put $1,000 in 2026 (Not Stocks!)",
        hook: "Inflation is eating bank savings, yet standard index funds are slowing down. Here is where the smart money is moving...",
        targetAudience: "Retail investors, young professionals",
        viralPotential: 97,
        competition: "Medium",
        engagementRating: "Outstanding"
      },
      {
        title: "How This Simple 50-30-20 Rule Saved Me From Absolute Debt",
        hook: "Three years ago, my bank account was zero. Here is the passive chart that saved my life.",
        targetAudience: "General public, beginners",
        viralPotential: 93,
        competition: "Low",
        engagementRating: "Very High"
      },
      {
        title: "I Automated My Passive Income (My Exact Setup Checked After 6 Months)",
        hook: "I set up three automated micro-income streams. Let's check the real dollar balances live.",
        targetAudience: "Passive income pursuers, side-hustlers",
        viralPotential: 95,
        competition: "High",
        engagementRating: "Outstanding"
      }
    ],
    scripts: {
      shorts: {
        hook: "Stop keeping your money in a standard checking account!",
        body: "You are literally losing spending power every second. By moving your emergency funds to high-yield cash sweep options, you earn passive interest with absolute zero risk of capital loss. Here is exactly how to do it in 60 seconds.",
        cta: "Save this video for later and follow for daily money tips!"
      },
      long: {
        intro: "Let's be completely honest: the old-school advice of just saving money and hoping for the best is financially dead. Let's map out a modern, bulletproof automatic capital framework.",
        point1: "The Automated Flow: Setting up direct-deposit splits so you pay your future self first.",
        point2: "Low-Maintenance Compound Growth: Understanding high-yield options that shield against sudden inflation.",
        point3: "The 3% Experiment: Allocating tiny speculative funds to high-ROI micro-assets without endangering your core security.",
        outro: "Remember, this isn't official financial advice, just my real experience. Comment 'automated' and I'll send you my worksheet!"
      }
    }
  },
  fitness: {
    ideas: [
      {
        title: "I Did 100 Pull-Ups Daily for 30 Days (Real Body Results)",
        hook: "No gym membership, no machines. Just one bar and absolute consistency. Here is what happened to my shoulders.",
        targetAudience: "Calisthenics lovers, exercise beginners",
        viralPotential: 94,
        competition: "Medium",
        engagementRating: "Outstanding"
      },
      {
        title: "5 Diet Mistakes That are Secretly Destroying Your Metabolism",
        hook: "Think you are eating healthy? These common superfoods might be keeping you bloated.",
        targetAudience: "Weight-loss seekers, healthy eaters",
        viralPotential: 89,
        competition: "High",
        engagementRating: "Very High"
      },
      {
        title: "The Ultimate 15-Minute Home Workout (No Equipment Needed)",
        hook: "No time is no longer an excuse. Follow along with this high-intensity fat burn sequence.",
        targetAudience: "Busy workers, busy moms, home athletes",
        viralPotential: 91,
        competition: "Low",
        engagementRating: "High"
      }
    ],
    scripts: {
      shorts: {
        hook: "Doing endless crunches for visible abs? Please stop!",
        body: "Abdominal muscles are defined in the kitchen. To see definition, focus on high-thermic foods, drinking massive amounts of water of at least 3 liters, and hitting a mild daily calorie deficit while maintaining robust protein intake.",
        cta: "Drop your current weight goals in the comment section and subscribe!"
      },
      long: {
        intro: "Hey guys! Today we are looking at real, evidence-based fitness that ignores all the complicated supplement marketing. Let's explain physical transformation simplified.",
        point1: "Hypertrophy Decoded: It is stimulus first. Focus on reaching progressive overload on every session.",
        point2: "Active Recovery Protocols: How sleep quality and deep hydration speed up tissue repairs twice as fast.",
        point3: "The Nutrition Blueprint: Matching macronutrients structure to functional daily energy expenditures.",
        outro: "Ready to take action? Check out the description for my free 30-day home planner. Stay strong, and see you next time!"
      }
    }
  },
  cooking: {
    ideas: [
      {
        title: "The Secret 3-Ingredient Recipe Master Chefs Store in Secret!",
        hook: "It takes under 5 minutes, costs pocket change, and tastes better than a Michelin star dinner.",
        targetAudience: "Home cooks, dessert lovers, students",
        viralPotential: 97,
        competition: "Low",
        engagementRating: "Outstanding"
      },
      {
        title: "I Recreated Legendary Anime Food in Real Life!",
        hook: "Is it actually delicious, or does it only look amazing on screen? Let's cook it step-by-step.",
        targetAudience: "Anime fans, foodies, experimental cooks",
        viralPotential: 92,
        competition: "Medium",
        engagementRating: "Very High"
      },
      {
        title: "Stop Cooking Steak the Wrong Way! (Do This Instead)",
        hook: "If you are putting your steak straight into a lukewarm pan, you are destroying high-grade meat.",
        targetAudience: "Steak enthusiasts, culinary beginners",
        viralPotential: 96,
        competition: "Medium",
        engagementRating: "Outstanding"
      }
    ],
    scripts: {
      shorts: {
        hook: "This single kitchen trick makes everything taste 10x better!",
        body: "Before cooking garlic, mince it and let it rest for 10 minutes. This fully activates allicin, which amplifies deep savory notes and supports health benefits! Add it only at the very end to prevent burning.",
        cta: "Follow for more lazy culinary hacks you actually need!"
      },
      long: {
        intro: "Welcome, friends! Today we are deconstructing classic culinary myths and cooking an incredible meal with absolute confidence. No complex tools, just pure flavor.",
        point1: "The Searing Secret: High heat and dry meat surfaces are non-negotiable for perfect caramelization.",
        point2: "Balance of Acids: Why adding a splash of fresh lemon or vinegar rescues flat dishes immediately.",
        point3: "Resting Metrics: Why meat juices need to redistribute before you even think of cutting a piece.",
        outro: "If you cooked along let me know how it turned out! Subscribe and leave a comment with your favorite seasoning."
      }
    }
  }
};

// Simple helper to generate highly relatable tags for any niche / custom keywords
export function getOptimizedTags(topic: string): string[] {
  const sanitize = topic.toLowerCase();
  const baseTags = ["#growth", "#viral", "#youtube", "#ai", "#trending"];
  
  if (sanitize.includes("code") || sanitize.includes("tech") || sanitize.includes("app") || sanitize.includes("ai")) {
    return ["#ai", "#technology", "#coding", "#software", "#developer", "#productivity", "#chatgpt", ...baseTags];
  }
  if (sanitize.includes("game") || sanitize.includes("stream") || sanitize.includes("play")) {
    return ["#gaming", "#gamer", "#gamers", "#xbox", "#playstation", "#indiegames", "#walkthrough", ...baseTags];
  }
  if (sanitize.includes("money") || sanitize.includes("finance") || sanitize.includes("rich") || sanitize.includes("saving") || sanitize.includes("crypto")) {
    return ["#finance", "#crypto", "#passiveincome", "#money", "#savingstips", "#investing", "#invest", ...baseTags];
  }
  if (sanitize.includes("fit") || sanitize.includes("weight") || sanitize.includes("gym") || sanitize.includes("workout")) {
    return ["#fitness", "#workout", "#gym", "#healthy", "#diet", "#shredded", "#healthylifestyle", ...baseTags];
  }
  if (sanitize.includes("food") || sanitize.includes("cook") || sanitize.includes("recipe") || sanitize.includes("eat")) {
    return ["#cooking", "#foodie", "#recipe", "#yummy", "#delicious", "#chef", "#baking", ...baseTags];
  }
  if (sanitize.includes("travel") || sanitize.includes("vlog") || sanitize.includes("trip")) {
    return ["#travel", "#vlog", "#wanderlust", "#adventure", "#vacation", "#explore", "#travelvlog", ...baseTags];
  }
  
  return ["#trending", "#youtube", "#shorts", "#creativity", "#videomaking", "#growthhacks", "#contentcreator", ...baseTags];
}

// Dynamically generate a title, description, and tags for ANY query
export function generateDynamicResponses(topic: string) {
  const cleanTopic = topic.trim() || "Amazing Video Topic";
  
  // Create multiple viral titles with hooks
  const titles = [
    `How I Mastered ${cleanTopic} inside 24 Hours! (Real Guide)`,
    `The Hidden Danger of ${cleanTopic} You Need to Know`,
    `I Tried ${cleanTopic} for 7 Days and Here is What Happened!`,
    `10 Hacks for ${cleanTopic} That Feel Illegal to Know 🤫`,
    `Why 99% of People Fail with ${cleanTopic} (And How to Fix It)`,
  ];

  const viralScore = Math.floor(Math.random() * 20) + 79; // score between 79 and 98
  const compLevels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const competition = compLevels[Math.floor(Math.random() * compLevels.length)];
  
  const engagements: ('Outstanding' | 'Very High' | 'High' | 'Steady')[] = ['Outstanding', 'Very High', 'High', 'Steady'];
  const engagement = engagements[Math.floor(Math.random() * engagements.length)];

  // Create descriptive paragraphs
  const description = `This video breaks down everything you need to know about ${cleanTopic} in a simple, step-by-step format for content creators, absolute beginners and seasoned pros alike.\n\nIn this video, you'll discover:\n✅ Practical frameworks you can implement today.\n✅ The common warning signals and mistakes to watch out for.\n✅ Exclusive workflows to double your outcome.\n\nMake sure to watch until the very end because point #3 will save you hours of unnecessary mistakes.\n\nTIMESTAMPS:\n0:00 - Introduction to the ${cleanTopic} secret\n2:15 - Core blueprint revealed\n5:40 - Advanced case studies and telemetry\n9:12 - Actionable summary & free bonuses!\n\n💡 Subscribe to the channel to get notifications about upcoming videos!`;

  const tags = getOptimizedTags(topic);

  // Creative video script elements
  const scriptShorts = {
    hook: `🛑 Drop everything! This single secret about "${cleanTopic}" will absolutely blow your mind today!`,
    body: `Most creators believe "${cleanTopic}" requires years of painful trial and error. But that is completely false. Here is the magic. First, isolate the main bottleneck. Second, use this automated AI process to run diagnostics. Finally, publish daily with visual hooks.`,
    cta: `Subscribe to my channel right now if you want to double your speed, and comment "${cleanTopic.split(' ')[0]}" below!`
  };

  const scriptLong = {
    intro: `Everyone is talking about ${cleanTopic} right now. But honestly, most of the advice out there is outdated. Today, we're cutting through the noise and building a clear, optimized strategy.`,
    point1: `The Foundations: Breaking down what makes ${cleanTopic} click, and why historical attempts failed.`,
    point2: `The System: Actionable tactics, step-by-step loops, and exactly what tools you need (including custom AI helpers).`,
    point3: `The Accelerators: How to multiply your speed, optimize for retention, and avoid common cognitive drains.`,
    outro: `We covered a lot today. Comment below if this gave you a concrete blueprint. Hit like, subscribe, and check my dashboard tips for extra workflows!`
  };

  return {
    titles,
    viralScore,
    competition,
    engagementRating: engagement,
    description,
    tags,
    scripts: {
      shorts: scriptShorts,
      long: scriptLong
    }
  };
}
