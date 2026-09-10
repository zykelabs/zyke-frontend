// Every piece of copy and data on the landing page lives here so the
// components stay presentational.

export const site = {
  name: "Zyke",
  tagline: "The AI marketing agent for your brand.",
  email: "founders@zyke.in",
  linkedin: "https://www.linkedin.com/company/zykelabs/",
  github: "https://github.com/zykelabs/zyke-frontend",
  youtubeId: "_z__HdAyjl8",
  youtubeUrl: "https://youtu.be/_z__HdAyjl8",
  builtAt: "IIT Kharagpur",
  years: "2024",
};

// Chapters follow the demo video's transcript.
export const chapters = [
  { t: 0, label: "0:00", title: "The landing page and the three promises" },
  { t: 33, label: "0:33", title: "Creating a brand voice (using Zomato as the example)" },
  { t: 65, label: "1:05", title: "Picking a topic: trends, or repurpose a blog or post" },
  { t: 88, label: "1:28", title: "A live trend: SpaceX catches a Starship booster" },
  { t: 105, label: "1:45", title: "AI proposes post ideas, you pick, or add your own" },
  { t: 136, label: "2:16", title: "Generating the posts: captions plus two or three images each" },
  { t: 175, label: "2:55", title: "Editing an image by clicking on it and typing a prompt" },
  { t: 221, label: "3:41", title: "Original versus edited, side by side" },
];

// The three things the product promised on its original landing page.
export const pillars = [
  {
    kicker: "01",
    title: "Align the AI with your brand voice",
    body: "Zyke researched the brand first. Website, social accounts, uploaded assets. From that it built a voice profile: tone, emotion, character, the jokes you would and would not make. Every later output was written through that profile, not a generic model default.",
  },
  {
    kicker: "02",
    title: "Edit generated content with precision prompts",
    body: "Instead of regenerating from scratch, you clicked a region of an image, the segmenter highlighted what you might have meant, you confirmed, and typed what should change. \"Make the background darker and add a galaxy\" did exactly that and nothing else.",
  },
  {
    kicker: "03",
    title: "Craft content from trends and viral ideas",
    body: "Live trends from Twitter, Instagram and LinkedIn were pulled in with an explanation of why each was trending, then bent toward your brand. A rocket landing became a post about delivery precision, because that is what the brand voice cared about.",
  },
];

// The end-to-end walkthrough, using the demo's Zomato x SpaceX example.
export const steps = [
  {
    n: "1",
    title: "Brand research and voice",
    demo: "The demo picks Zomato, an Indian food-delivery company known for cheeky marketing.",
    body: "You entered the brand's name, links and a few sentences. Zyke scraped the public footprint, ran it through vision and language models, and produced a brand voice with tone, emotion and character filters you could adjust and save.",
    image: null,
  },
  {
    n: "2",
    title: "Ideas from what is trending",
    demo: "Trending at that moment: SpaceX catching a Starship booster with the launch tower.",
    body: "The idea generator listed live trends with a short explanation of each. Pick one, or paste a blog or Instagram URL to repurpose, or type your own topic. Zyke returned a handful of ideas in the brand's voice and let you tick the ones worth making. There was also a checkbox to let the AI invent one more idea on its own.",
    image: null,
  },
  {
    n: "3",
    title: "Posts, with images, in the brand's voice",
    demo: "Three ideas became nine posts. Each post had two or three AI-generated images following a small storyline.",
    body: "Captions came from a reasoning model prompted with the brand voice. Images came from a FLUX diffusion model, one per beat of the story. \"SpaceX vs Zomato infographic\", \"Zomato Mission Control\", and the AI's own idea about aliens ordering fries.",
    image: "/posts/Idea1Post1Img3.png",
  },
  {
    n: "4",
    title: "Point, describe, done",
    demo: "\"Make the background darker and add a galaxy with some planets.\"",
    body: "Click on the image. A segmentation model proposed regions. Confirm the one you meant, describe the change, and an inpainting model repainted only that region. The rest of the post stayed pixel-identical.",
    image: null,
  },
];

export const beforeAfter = {
  before: "/posts/Idea3Post2Img1.png",
  after: "/generated/fixed.png",
  mask: "/masks/L_Model_blended_img_1.png",
  prompt: "Make the background darker and add a galaxy with some planets",
};

// The full feature list from the product demo description.
export const features = [
  { title: "Brand research and profiling", body: "Scrape the brand's site and socials, then summarise who it is and who it talks to.", group: "Understand" },
  { title: "Brand voice creation", body: "Tone, emotion and character filters derived from real content, editable and saved per brand.", group: "Understand" },
  { title: "Customer profile mapping", body: "Who the audience is, what they respond to, and which platforms they live on.", group: "Understand" },
  { title: "User engagement tracking", body: "How posts performed, folded back into what gets generated next.", group: "Measure" },
  { title: "Dashboard with custom metrics", body: "The numbers a marketing team actually watches, not a generic analytics panel.", group: "Measure" },
  { title: "Trending topics, tailored to you", body: "Live trends from Twitter, Instagram and LinkedIn, explained, then bent toward the brand.", group: "Discover" },
  { title: "Personalised brand recommendations", body: "What to post, when, and why, based on the voice and the audience.", group: "Discover" },
  { title: "Content generation engine", body: "Text, images and video, generated in one pass from a chosen idea.", group: "Create" },
  { title: "Prompt-based content editing", body: "Restyle text or images with a sentence. Click-to-segment editing for precise image changes. A Canva-style editor was on the roadmap.", group: "Create" },
  { title: "Video storyboards", body: "Shot-by-shot outlines for short video, in the same voice as the posts.", group: "Create" },
  { title: "Moodboarding", body: "A visual direction for a campaign before any post is made.", group: "Create" },
  { title: "Post attention analysis", body: "Where the eye goes on a generated image, and whether that is where the message is.", group: "Measure" },
  { title: "Post-generation content analysis", body: "A second pass over generated content checking it against the brand voice and the goal.", group: "Measure" },
];

export const featureGroups = ["Understand", "Discover", "Create", "Measure"] as const;

// Every image in this gallery was generated by Zyke during the demo run.
export const gallery = [
  { src: "/posts/Idea1Post1Img1.jpg", idea: "SpaceX vs Zomato", caption: "Boosters at 2,500 mph, your pizza in 25 minutes" },
  { src: "/posts/Idea1Post1Img2.png", idea: "SpaceX vs Zomato", caption: "Catching boosters vs catching cravings" },
  { src: "/posts/Idea1Post1Img3.png", idea: "SpaceX vs Zomato", caption: "Precision infographic" },
  { src: "/posts/Idea2Post1Img1.png", idea: "Zomato Mission Control", caption: "Every order tracked like a launch" },
  { src: "/posts/Idea2Post1Img2.png", idea: "Zomato Mission Control", caption: "Delivery success, planted" },
  { src: "/posts/Idea2Post1Img3.png", idea: "Zomato Mission Control", caption: "Extra cheese engaged" },
  { src: "/posts/Idea3Post1Img1.png", idea: "AI's own idea", caption: "Blast off" },
  { src: "/posts/Idea3Post1Img2.png", idea: "AI's own idea", caption: "Same precision, different missions" },
  { src: "/posts/Idea3Post1Img3.png", idea: "AI's own idea", caption: "Hungry in space" },
  { src: "/posts/Idea3Post2Img1.png", idea: "AI's own idea", caption: "The one we edited in the demo" },
  { src: "/posts/Idea3Post2Img2.png", idea: "AI's own idea", caption: "Rooftop landing" },
  { src: "/posts/Idea3Post3Img1.png", idea: "AI's own idea", caption: "Asteroid fries" },
  { src: "/posts/Idea3Post3Img2.png", idea: "AI's own idea", caption: "Chef in orbit" },
];

// What actually ran behind the product, from the source code.
export const stack = [
  {
    layer: "Web app",
    items: ["Next.js 14, TypeScript, Tailwind", "NextAuth sessions with email OTP sign-up", "Razorpay wallet for credits"],
  },
  {
    layer: "API",
    items: ["Flask 3 on AWS EC2 (Mumbai), gunicorn", "MongoDB for users, brand voices, posts, transactions", "Eleven blueprints, twenty-seven routes"],
  },
  {
    layer: "Language models",
    items: ["OpenAI o1-mini for ideas and captions", "Llama 3.1 and GPT-4o mini (vision) for brand research", "Gemini 1.5 Flash for repurposing URLs", "Perplexity Sonar for explaining trends"],
  },
  {
    layer: "Image models",
    items: ["FLUX 1.1 Pro for post images", "A click-to-segment model on a GPU in Google Cloud Run", "Stability AI inpainting for edits"],
  },
  {
    layer: "Data",
    items: ["Google Trends for what is trending", "Instagram and web scraping for brand research", "Google Cloud Storage for media"],
  },
];

export const timeline = [
  { when: "July 2024", what: "Version zero. One Flask route, one hand-written page, a five-stage prompt chain on Claude 3.5 Sonnet and FLUX. Live at www.zyke.in." },
  { when: "August 2024", what: "Shared with a second builder. Posts split per platform, newer image model, first outside users." },
  { when: "October 2024", what: "Full rewrite in three weeks: Next.js app, Flask and MongoDB API, accounts, brand voice, trends, repurposing, payments." },
  { when: "November 2024", what: "Version 1.0. Click-to-segment image editing on a GPU service. This demo was recorded." },
  { when: "2025", what: "The company wound down. The code and this page stay up so the work is not lost." },
];
