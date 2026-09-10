// Every piece of copy and data on the page lives here so the components stay
// presentational.

export const site = {
  name: "Zyke",
  email: "founders@zyke.in",
  linkedin: "https://www.linkedin.com/company/zykelabs/",
  github: "https://github.com/zykelabs/zyke-frontend",
  youtubeId: "_z__HdAyjl8",
  youtubeUrl: "https://youtu.be/_z__HdAyjl8",
};

// Chapters follow the demo video's transcript.
export const chapters = [
  { t: 0, label: "0:00", title: "The landing page and the three promises" },
  { t: 33, label: "0:33", title: "Creating a brand voice, with Zomato as the example" },
  { t: 65, label: "1:05", title: "Picking a topic: a trend, or a blog or post to repurpose" },
  { t: 88, label: "1:28", title: "A live trend: SpaceX catches a Starship booster" },
  { t: 105, label: "1:45", title: "Zyke proposes ideas; you pick, or add your own" },
  { t: 136, label: "2:16", title: "Generating the posts: captions and two or three images each" },
  { t: 175, label: "2:55", title: "Editing an image by clicking on it and typing a prompt" },
  { t: 221, label: "3:41", title: "Original and edited, side by side" },
];

export const pillars = [
  {
    n: "I",
    title: "It aligned the AI with your brand voice.",
    body: "Zyke researched the brand first: website, social accounts, anything you uploaded. From that it wrote a voice profile with tone, emotion and character, which you could correct and save. Every later output was written through that profile rather than a model's default register.",
  },
  {
    n: "II",
    title: "It let you edit generated content with precise prompts.",
    body: "You clicked a region of an image. A segmentation model proposed what you might have meant. You confirmed and typed the change. Only that region was repainted; the rest of the image stayed as it was.",
  },
  {
    n: "III",
    title: "It made content from what was trending.",
    body: "Live trends from Twitter, Instagram and LinkedIn arrived with a short explanation of why each was trending, then were bent toward the brand. A rocket landing became a post about delivery precision because that is what the brand's voice cared about.",
  },
];

export const steps = [
  {
    n: "1",
    title: "Brand research and voice",
    demo: "In the demo the brand is Zomato, an Indian food-delivery company known for cheeky marketing.",
    body: "You entered the brand's name, links and a few sentences. Zyke read the public footprint with vision and language models and produced a brand voice: tone, emotion and character filters you could adjust and save.",
  },
  {
    n: "2",
    title: "Ideas from what is trending",
    demo: "Trending that day: SpaceX catching a Starship booster with the launch tower.",
    body: "The idea generator listed live trends with a one-paragraph explanation of each. You could pick one, paste a blog or Instagram URL to repurpose, or type a topic. Zyke returned several ideas in the brand's voice for you to tick, and a checkbox let it add one idea of its own.",
  },
  {
    n: "3",
    title: "Posts with images, in the brand's voice",
    demo: "Three ideas became nine posts, each with two or three images following a small storyline.",
    body: "Captions came from a reasoning model prompted with the brand voice. Images came from a FLUX diffusion model, one per beat of the story: a SpaceX-versus-Zomato infographic, Zomato Mission Control, and the model's own idea about aliens ordering fries.",
  },
  {
    n: "4",
    title: "Point, describe, done",
    demo: "“Make the background darker and add a galaxy with some planets.”",
    body: "Click on the image, confirm the region the segmenter proposes, describe the change. An inpainting model repainted only that region. The scooter, the rider and the pizza box were untouched.",
  },
];

export const beforeAfter = {
  before: "/posts/Idea3Post2Img1.png",
  after: "/generated/fixed.png",
  prompt: "Make the background darker and add a galaxy with some planets",
};

export const features = [
  { n: "01", title: "Brand research and profiling", body: "Read the brand's site and socials, then describe who it is and who it talks to." },
  { n: "02", title: "Brand voice creation", body: "Tone, emotion and character filters derived from real content, editable and saved per brand." },
  { n: "03", title: "Customer profile mapping", body: "Who the audience is, what they respond to, where they are." },
  { n: "04", title: "User engagement tracking", body: "How posts performed, fed back into what gets generated next." },
  { n: "05", title: "Dashboard with custom metrics", body: "The numbers a marketing team watches, not a generic analytics panel." },
  { n: "06", title: "Trending topics, tailored to the brand", body: "Live trends from Twitter, Instagram and LinkedIn, explained, then bent toward the brand." },
  { n: "07", title: "Personalised brand recommendations", body: "What to post, when, and why, based on the voice and the audience." },
  { n: "08", title: "Content generation engine", body: "Text, images and video, generated in one pass from a chosen idea." },
  { n: "09", title: "Content editing pipelines", body: "Restyle text or images with a sentence; click-to-segment editing for precise changes. A Canva-style editor was next on the roadmap." },
  { n: "10", title: "Video storyboards", body: "Shot-by-shot outlines for short video, in the same voice as the posts." },
  { n: "11", title: "Moodboarding", body: "A visual direction for a campaign before any post is made." },
  { n: "12", title: "Post attention analysis", body: "Where the eye goes on a generated image, and whether that is where the message is." },
  { n: "13", title: "Post-generation content analysis", body: "A second pass over generated content, checking it against the brand voice and the goal." },
];

// Every image in the gallery was generated by Zyke during the demo run.
export const gallery = [
  { src: "/posts/Idea1Post1Img1.jpg", idea: "SpaceX vs Zomato", caption: "Boosters at 2,500 mph, your pizza in 25 minutes" },
  { src: "/posts/Idea1Post1Img2.png", idea: "SpaceX vs Zomato", caption: "Catching boosters, catching cravings" },
  { src: "/posts/Idea1Post1Img3.png", idea: "SpaceX vs Zomato", caption: "The precision infographic" },
  { src: "/posts/Idea2Post1Img1.png", idea: "Zomato Mission Control", caption: "Every order tracked like a launch" },
  { src: "/posts/Idea2Post1Img2.png", idea: "Zomato Mission Control", caption: "Delivery success, planted" },
  { src: "/posts/Idea2Post1Img3.png", idea: "Zomato Mission Control", caption: "Extra cheese engaged" },
  { src: "/posts/Idea3Post1Img1.png", idea: "The model's own idea", caption: "Blast off" },
  { src: "/posts/Idea3Post1Img2.png", idea: "The model's own idea", caption: "Same precision, different missions" },
  { src: "/posts/Idea3Post1Img3.png", idea: "The model's own idea", caption: "Hungry in space" },
  { src: "/posts/Idea3Post2Img1.png", idea: "The model's own idea", caption: "The image edited in the demo" },
  { src: "/posts/Idea3Post2Img2.png", idea: "The model's own idea", caption: "Rooftop landing" },
  { src: "/posts/Idea3Post3Img1.png", idea: "The model's own idea", caption: "Asteroid fries" },
  { src: "/posts/Idea3Post3Img2.png", idea: "The model's own idea", caption: "Chef in orbit" },
];

export const stack = [
  { layer: "Web app", items: ["Next.js 14, TypeScript, Tailwind", "Email sign-up with one-time codes", "Razorpay wallet for credits"] },
  { layer: "API", items: ["Flask on AWS EC2 in Mumbai, behind gunicorn", "MongoDB for users, brand voices, posts and transactions", "Eleven blueprints, twenty-seven routes"] },
  { layer: "Language models", items: ["OpenAI o1-mini for ideas and captions", "Llama 3.1 and GPT-4o mini (vision) for brand research", "Gemini 1.5 Flash for repurposing URLs", "Perplexity Sonar for explaining trends"] },
  { layer: "Image models", items: ["FLUX 1.1 Pro for post images", "A click-to-segment model on a GPU in Google Cloud Run", "Stability AI inpainting for edits"] },
  { layer: "Data", items: ["Google Trends", "Instagram and web scraping for brand research", "Google Cloud Storage for media"] },
];

export const timeline = [
  { when: "July 2024", what: "Version zero. One Flask route, one hand-written page, a five-stage prompt chain on Claude 3.5 Sonnet and FLUX. Live at www.zyke.in." },
  { when: "August 2024", what: "Posts split per platform. Newer image model. Source shared with a second builder." },
  { when: "October 2024", what: "Rewritten in three weeks: Next.js app, Flask and MongoDB API, accounts, brand voice, trends, repurposing, payments." },
  { when: "November 2024", what: "Version 1.0. Click-to-segment image editing on a GPU service. The demo above was recorded." },
  { when: "2025", what: "The company wound down. The domain, the code and this page remain." },
];
