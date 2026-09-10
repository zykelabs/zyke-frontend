// Every piece of copy and data on the page lives here so the components stay
// presentational.

export const site = {
  name: "Zyke",
  email: "founders@zyke.in",
  linkedin: "https://www.linkedin.com/company/zykelabs/",
  github: "https://github.com/zykelabs",
  githubFrontend: "https://github.com/zykelabs/zyke-frontend",
  githubBackend: "https://github.com/zykelabs/zyke-backend",
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
  before: "/masks/L_Model_blended_img_1.png",
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
  { layer: "Trends and recommendation", items: ["Google Trends daily searches for India, through pytrends", "Perplexity Sonar to explain why each topic is trending", "OpenAI o1-mini to score and rank trends per brand", "Six-hour caches, billed to a house account"] },
  { layer: "Language models", items: ["OpenAI o1-mini for ranking, ideas, captions and edit routing", "Llama 3.1 and GPT-4o mini (vision) for brand research", "Gemini 1.5 Flash for repurposing URLs"] },
  { layer: "Image generation", items: ["FLUX 1.1 Pro through Together AI, fifty steps", "Batches of four with a hand-rolled rate limiter"] },
  { layer: "Image editing", items: ["GraCo, granularity-controllable interactive segmentation, on a GPU", "Grounding DINO for open-vocabulary object detection", "Styling LoRAs for whole-image restyling", "Stability AI inpainting and image to image", "OpenCV locally for mask dilation and previews"] },
  { layer: "Data", items: ["Instagram and web scraping for brand research", "Google Cloud Storage for media", "Google Cloud Run and Modal for the GPU services"] },
];

export const timeline = [
  { when: "July 2024", what: "Version zero. One Flask route, one hand-written page, a five-stage prompt chain on Claude 3.5 Sonnet and FLUX. Live at www.zyke.in." },
  { when: "August 2024", what: "Posts split per platform. Newer image model. Source shared with a second builder." },
  { when: "October 2024", what: "Rewritten in three weeks: Next.js app, Flask and MongoDB API, accounts, brand voice, trends, repurposing, payments." },
  { when: "November 2024", what: "Version 1.0. Click-to-segment image editing on a GPU service. The demo above was recorded." },
  { when: "2025", what: "The company wound down. The domain, the code and this page remain." },
];

// ---------------------------------------------------------------------------
// From the pitch deck, December 2024. Kept as it was written then.
// ---------------------------------------------------------------------------

export const problems = [
  {
    n: "01",
    title: "Agencies cost too much.",
    body: "A branding agency was out of reach for most of the companies we spoke to. The cheap alternatives were generic and still took a lot of back and forth to get anything usable.",
  },
  {
    n: "02",
    title: "The AI tools did not sound like you.",
    body: "Everything on the market wrote in the same flat register. It missed what the brand was actually about, so what came out was off-brand in a way that was hard to fix.",
  },
  {
    n: "03",
    title: "In-house teams were guessing.",
    body: "Trial and error, one post at a time. By the time a team had something ready, the trend it was chasing had moved on.",
  },
];

export const coreNeed =
  "One tool that was efficient, affordable and actually personal to the brand.";

export const buyers = [
  {
    who: "Small firms",
    need: "Posts on trending topics, cheap enough to run every week.",
    quote:
      "We can give better services than UC but their brand is too big; they have funds large enough to afford crazy branding.",
    by: "Mayank Arya",
    role: "Founder",
  },
  {
    who: "Medium companies",
    need: "Brand-relevant content, produced often enough to grow visibility.",
    quote:
      "I would give you anything if you can give me better KPIs with measures on how to improve them.",
    by: "Akash Walia",
    role: "Marketing manager",
  },
  {
    who: "Large companies",
    need: "Creative work that moves brand positioning, not just fills a calendar.",
    quote:
      "We are a one stop solution, but we need to know what the customer is looking at majorly, so we can show that.",
    by: "Harshvardhan Chauhan",
    role: "Former CMO, retail",
  },
];

// Yes / no across Zyke and the three tools we were compared against.
export const comparison = {
  columns: ["Zyke", "Tool A", "Tool B", "Tool C"],
  rows: [
    { feature: "Trend analysis", values: [true, false, false, false] },
    { feature: "Personalised content generation", values: [true, true, true, true] },
    { feature: "Brand voice", values: [true, true, false, false] },
    { feature: "Repurpose existing content", values: [true, true, false, false] },
    { feature: "Prompt-based image editing", values: [true, false, false, false] },
    { feature: "Image generation", values: [true, true, false, true] },
  ],
};

export const economics = [
  { figure: "$0.05", label: "What one generated post cost us", note: "Model calls and storage for a single image." },
  { figure: "$0.20", label: "What we charged for it", note: "Pay as you go, once the free credits ran out." },
  { figure: "$0.70", label: "One brand voice, once", note: "Research, vision calls and the profile write-up." },
  { figure: "$5.00", label: "Free credits on sign-up", note: "Enough to make a real campaign before paying." },
];

export const market = [
  { figure: "$30.34B", label: "Total market we were sizing against" },
  { figure: "$2.2B", label: "The slice we could actually serve" },
  { figure: "36.2%", label: "Growth rate for AI in social media, to 2032" },
  { figure: "₹208 cr", label: "Spent on digital media by about a million Indian SMEs" },
];

export const marketerUse = [
  { pct: "33%", what: "Generate ideas and inspiration" },
  { pct: "28%", what: "Write copy and content" },
  { pct: "26%", what: "Create marketing images" },
];

export const team = [
  { name: "Tasmay P. Tibrewal", role: "CTO turned CEO", linkedin: "https://www.linkedin.com/in/tasmay-tibrewal/" },
  { name: "Rupam Mahato", role: "Founding engineer", linkedin: "https://www.linkedin.com/in/rupammahato/" },
  { name: "Siddharth Dikshit", role: "Co-founder and CEO until November. Left after the dispute.", linkedin: "" },
];

export const people = [
  { name: "Tasmay", role: "Founder", linkedin: "https://www.linkedin.com/in/tasmay-tibrewal/" },
  { name: "Rupam", role: "Founding member", linkedin: "https://www.linkedin.com/in/rupammahato/" },
];

export const grants = [
  { org: "Y Combinator", amount: "$25,000", what: "Startup school credits across cloud and tooling" },
  { org: "Modal Labs", amount: "$11,000", what: "GPU credits to serve the segmentation model" },
  { org: "Daytona", amount: "$10,000", what: "Development environment credits" },
  { org: "CampusFund", amount: "$5,000", what: "AWS credits to build the MVP" },
  { org: "Google Cloud for Startups", amount: "$2,000", what: "Cloud Run and storage" },
  { org: "Microsoft for Startups", amount: "$1,000", what: "Azure credits" },
  { org: "MongoDB for Startups", amount: "$500", what: "Database credits" },
];


// ---------------------------------------------------------------------------
// Work Zyke produced during testing, for Zomato, Bira 91, Nike and a coding
// school. We did not write these. Zyke read the day's trends, picked one,
// decided how to tie it to the brand, wrote the caption and generated the
// picture.
//
// Organised by month, because the month is the story. Between September and
// November 2024 we rebuilt the image stage twice, and the difference is visible
// without knowing anything about the code.
// ---------------------------------------------------------------------------

export type Piece = {
  src: string;
  w: number;
  h: number;
  brand: string;
  trend: string;
  caption: string;
};

export type Month = {
  id: string;
  month: string;
  res: string;
  headline: string;
  note: string;
  pieces: Piece[];
};

export const months: Month[] = [
  {
    id: "sept",
    month: "September 2024",
    res: "512 px",
    headline: "It could compose. It could not write.",
    note:
      "The early runs. Zyke already had the interesting part working: it found a trend, made the leap to the brand and built a picture around it. What it could not do was put a legible word on the canvas. Headlines came out as letter-shaped noise, and anything that needed a chart or a label fell apart completely.",
    pieces: [
      { src: "/gallery/sept-rider-over-earth.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A rider lifting off Earth on a pizza-fuelled exhaust trail. No text, so nothing to get wrong. This is the picture edited in the demo above." },
      { src: "/gallery/sept-scooter-and-rocket.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A scooter watching a rocket leave with the delivery box strapped to it. The sound effects are meant to read VOOM and BLAST OFF." },
      { src: "/gallery/sept-mission-control.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A delivery mission control room. Fourteen screens, not one readable word on any of them." },
      { src: "/gallery/sept-booster-timeline.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "An attempt at a data story about delivery milestones. The shape of an infographic with none of the substance." },
      { src: "/gallery/sept-bira-two-landmarks.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", caption: "One bottle between the Statue of Liberty and the Eiffel Tower. The label almost holds together." },
      { src: "/gallery/sept-bira-citrus.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "No trend", caption: "A split product shot, pineapple on one side and hard orange on the other. The three feature callouts are illegible." },
      { src: "/gallery/sept-beer-for-everyone.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "No trend", caption: "Myth on the left, fact on the right, and a crowd disagreeing with the man in the suit. Zyke picked the argument itself." },
    ],
  },
  {
    id: "oct",
    month: "October 2024",
    res: "512 to 1024 px",
    headline: "Headlines start landing.",
    note:
      "We rewrote the pipeline this month: image prompts now came out of the brand voice rather than the caption, and we moved to FLUX 1.1 Pro. Short headlines and logos start coming out correctly. Body copy and anything small still collapses, so Zyke was at its best when it had one line to say.",
    pieces: [
      { src: "/gallery/oct-space-vs-delivery.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "Every word correct: how space delivers boosters, how Zomato delivers your pizza, same precision, different missions." },
      { src: "/gallery/oct-booster-chart.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A bar chart nobody asked for. The bar labels are right, the headline above them is not." },
      { src: "/gallery/oct-aliens-and-fries.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The US alien files", caption: "Four aliens in orbit arguing over asteroid fries and galaxy sauce. The Zomato wordmark is perfect; the speech bubbles are half there." },
      { src: "/gallery/oct-newspaper-front-page.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Prime Minister", caption: "An invented newspaper front page announcing Operation Zomato Feast. The masthead and headline read cleanly, the article underneath is noise." },
      { src: "/gallery/oct-indiacentury-menu.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "The Prime Minister", caption: "A four-panel campaign around a hashtag it made up. First run at 1024 px, and the jump in detail is obvious." },
      { src: "/gallery/oct-rocket-and-scooter.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A spec-sheet comparison between a rocket and a scooter. It knew the format; it could not fill it in." },
      { src: "/gallery/oct-moon-head.jpeg", w: 512, h: 512, brand: "Zomato", trend: "No trend", caption: "A man with the moon for a head feeding someone dinner. We include this one because it is the strangest thing Zyke ever produced." },
      { src: "/gallery/oct-bira-diwali.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Diwali", caption: "Two glasses meeting in front of a blurred rangoli of light. The best-looking thing it made this month." },
      { src: "/gallery/oct-bira-america.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", caption: "Six bottles on a Stars and Stripes, lit like a product shoot. Every label spelled correctly." },
      { src: "/gallery/oct-bira-myth-and-fact.jpeg", w: 885, h: 437, brand: "Bira 91", trend: "Myths about beer", caption: "Two slides from a myth-and-fact carousel, including a calorie chart it invented the numbers for." },
      { src: "/gallery/oct-brewing-perfect-code.jpeg", w: 512, h: 512, brand: "A coding school", trend: "Developer culture", caption: "Half brewery, half editor, one chimp holding the sign. Brewing The Perfect Code, spelled exactly right." },
      { src: "/gallery/oct-lebron-spec-sheet.jpeg", w: 400, h: 400, brand: "Nike", trend: "Basketball season", caption: "A shoe spec sheet. The product name lands, the specifications are decorative." },
    ],
  },
  {
    id: "nov",
    month: "November 2024",
    res: "1024 to 1600 px",
    headline: "This is where it becomes consistent.",
    note:
      "Version 1.0. Full sentences hold, logos are right, faces are deliberate, and the same idea run twice comes back looking like the same campaign rather than two accidents. This is the month the output stopped being a demo of a pipeline and started looking like work a brand could actually post.",
    pieces: [
      { src: "/gallery/nov-smart-routing.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", caption: "Every word correct, twice, in two different type treatments, plus a clean logo lockup in the corner. Compare this to the September mission control room." },
      { src: "/gallery/nov-how-it-feels.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", caption: "Gridlock above, a rider getting through below. Headline correct, and the branding on the box in the corner is correct too." },
      { src: "/gallery/nov-delhi-landmarks.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", caption: "A red scooter throwing sparks past India Gate at sunset. One letter wrong in the whole picture." },
      { src: "/gallery/nov-stuck-in-traffic.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", caption: "Two panels, same rider. The top line is perfect and the bottom one slips, which is roughly where the model was that week." },
      { src: "/gallery/nov-scaling-heights-wide.jpeg", w: 1600, h: 1066, brand: "Zomato", trend: "The Prime Minister", caption: "The sharpest thing it ever made. A national endorsement nobody asked it for, at 1600 px, with a hashtag of its own invention." },
      { src: "/gallery/nov-scaling-heights.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "The Prime Minister", caption: "The same idea in a square crop for a feed. It held the composition, the lighting and the headline across both formats." },
      { src: "/gallery/nov-better-food-first-run.jpeg", w: 1600, h: 1066, brand: "Zomato", trend: "The Prime Minister", caption: "First run of a two-panel post. Left panel clean, right panel still garbling its own caption." },
      { src: "/gallery/nov-better-food-second-run.jpeg", w: 1600, h: 1066, brand: "Zomato", trend: "The Prime Minister", caption: "Second run of the same idea, minutes later. Both headlines correct and both boxes correctly branded. This pair is the clearest proof of the jump." },
      { src: "/gallery/nov-cooking-better-india.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "The Prime Minister", caption: "A different register entirely, rendered as a 3D cartoon, with the headline and the sub-line both correct." },
      { src: "/gallery/nov-three-steps.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "No trend", caption: "Three stacked cards explaining a delivery. It repeats itself once, but the layout is something a designer would recognise." },
      { src: "/gallery/nov-eat-light.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Get-ready-with-me", caption: "A four-panel beauty collage in purple, laid out on a real grid with consistent type across all four." },
      { src: "/gallery/nov-beauty-hacks.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Get-ready-with-me", caption: "The same format on a white ground. Composition good, the floating labels never resolved." },
      { src: "/gallery/nov-lebron-confetti.jpeg", w: 844, h: 844, brand: "Nike", trend: "Basketball season", caption: "Confetti, a lit arena and a shoe in focus with the athlete deliberately thrown out of focus behind it. That depth of field was asked for and delivered." },
      { src: "/gallery/nov-empty-gym.jpeg", w: 340, h: 340, brand: "Nike", trend: "Basketball season", caption: "An empty gym, hard side light, one figure mid-shot. No text at all, which by November was a choice rather than a limitation." },
      { src: "/gallery/nov-court-shoes.jpeg", w: 340, h: 340, brand: "Nike", trend: "Basketball season", caption: "A close crop on the shoes with the court blurring past. Zyke chose the crop." },
      { src: "/gallery/nov-astronaut-flag.jpeg", w: 512, h: 512, brand: "Zomato", trend: "The Starship booster catch", caption: "A late 512 px run on an older idea, kept here because it shows the ceiling was the resolution rather than the idea." },
    ],
  },
];

// The three cards at the top of the section. Same pipeline, three months apart.
export const progression = [
  {
    id: "sept",
    when: "September 2024",
    size: "512 x 512",
    src: "/gallery/sept-mission-control.jpeg",
    w: 512,
    h: 512,
    what: "Fourteen screens in a mission control room and not one readable word. It could compose a scene and not label it.",
  },
  {
    id: "oct",
    when: "October 2024",
    size: "512 to 1024",
    src: "/gallery/oct-booster-chart.jpeg",
    w: 512,
    h: 512,
    what: "Short lines start landing. The bars here are labelled correctly; the headline above them still is not.",
  },
  {
    id: "nov",
    when: "November 2024",
    size: "1024 to 1600",
    src: "/gallery/nov-scaling-heights-wide.jpeg",
    w: 1600,
    h: 1066,
    what: "Full sentences, correct logos, deliberate faces, and the same idea reproducible across two formats.",
  },
];

// The pair that shows the November jump on its own.
export const sameIdeaTwice = {
  first: { src: "/gallery/nov-better-food-first-run.jpeg", w: 1600, h: 1066 },
  second: { src: "/gallery/nov-better-food-second-run.jpeg", w: 1600, h: 1066 },
};

// ---------------------------------------------------------------------------
// The image pipeline, and the things we had to build ourselves because they
// did not exist yet. All taken from the code.
// ---------------------------------------------------------------------------

export const era2024 = [
  "There was no Nano Banana and no GPT Image. There was no model you could hand a picture and a sentence to and get the picture back, changed.",
  "Image models could not write. Any text in a picture came out as approximate letter shapes, which is why almost every headline from the early months is misspelled.",
  "A megapixel was the ceiling. 1024 by 1024 was a good day.",
  "Instruction following was weak. A long prompt with several requirements in it would get two of them.",
  "Nothing kept a character, a product or a layout consistent between two runs, so a set of images that told one story had to be forced.",
];

export const pipeline = [
  {
    n: "1",
    title: "One idea becomes several image prompts",
    body: "The reasoning model was asked for a post as XML, with a caption and a list of image prompts inside it, and told to vary how many images each post got. That is how the images in a post form a sequence instead of three versions of the same picture. Structured output was not reliable in 2024, so every prompt asked for XML tags and we parsed them by hand.",
  },
  {
    n: "2",
    title: "The brand voice goes in as its own message",
    body: "Not a line in a system prompt. A saved record with the company research, the tone, emotion and character filters, and an analysis of the brand's own past posts, injected as a separate system message on every single call. It is the reason two brands given the same trend came back with different posts.",
  },
  {
    n: "3",
    title: "Images generated four at a time",
    body: "FLUX 1.1 Pro through Together AI, fifty steps, at four and a bit cents an image. Requests went out in batches of four with a pause between them to stay inside the rate limit, then every image was downloaded and inlined so a post travelled as one object.",
  },
];

export const novelties = [
  "A reasoning model routing image edits by tool call, deciding whether your sentence meant a region, an object, the whole frame or the style, a year before agentic image editing was a normal idea.",
  "One click returning several masks at several granularities, so the model asked what you meant instead of guessing.",
  "Open-vocabulary detection wired to the prompt, so you could name a thing you had not clicked and have it found, changed or deleted.",
  "Style handled by LoRAs rather than by prompt, so a restyle kept the picture instead of redrawing it.",
  "Candidate masks shown as previews on your own image, free to browse, so a segmentation model became usable by a marketing person.",
  "Every edit applied to the original rather than the last result, with full undo history, so passes did not compound.",
  "Trends scored per brand from the brand's own history, with creative brands pushed toward the leaps and traditional brands pushed away from them.",
  "Trends explained before being ranked, because a brand can react to a reason but not to a noun.",
  "Trend, idea and post as three separate stages you could stop and steer between, each parsed from tagged output.",
  "Every generation metered to the cent, with trend research billed to a house account instead of the user.",
];

// The leaps Zyke made on its own, from a headline to a brand. Nobody wrote
// these connections down for it.
export const leaps = [
  {
    trend: "The US government released its files on unidentified objects",
    brand: "Zomato",
    leap:
      "Declassified alien files were the story of the week. Zyke decided that if aliens are real then they are a market, and started writing posts about serving them. The asteroid fries and the galaxy sauce are its words.",
    shots: [
      { src: "/gallery/oct-aliens-and-fries.jpeg", w: 512, h: 512, when: "Oct" },
    ],
  },
  {
    trend: "The Prime Minister was all over the Indian news",
    brand: "Zomato",
    leap:
      "It read the domestic news cycle, saw one name in most of it, and concluded that the move was a national endorsement. Nobody asked it for a politician. It also invented the hashtag, and then reused that hashtag consistently across a whole campaign.",
    shots: [
      { src: "/gallery/oct-newspaper-front-page.jpeg", w: 512, h: 512, when: "Oct" },
      { src: "/gallery/nov-scaling-heights.jpeg", w: 1024, h: 1024, when: "Nov" },
      { src: "/gallery/nov-cooking-better-india.jpeg", w: 1024, h: 1024, when: "Nov" },
    ],
  },
  {
    trend: "SpaceX caught a Starship booster with the launch tower",
    brand: "Zomato",
    leap:
      "The trend everyone was posting about. Its angle was that catching a hundred-tonne booster and getting an order right are the same claim about precision, and it pushed that until it had built a bar chart of it.",
    shots: [
      { src: "/gallery/sept-mission-control.jpeg", w: 512, h: 512, when: "Sept" },
      { src: "/gallery/oct-space-vs-delivery.jpeg", w: 512, h: 512, when: "Oct" },
      { src: "/gallery/oct-booster-chart.jpeg", w: 512, h: 512, when: "Oct" },
    ],
  },
  {
    trend: "Delhi traffic",
    brand: "Zomato",
    leap:
      "The least exotic trend it ever picked, and the closest to the product. If the city cannot move, the interesting thing about a delivery company is that its riders still do.",
    shots: [
      { src: "/gallery/nov-delhi-landmarks.jpeg", w: 1024, h: 1024, when: "Nov" },
      { src: "/gallery/nov-smart-routing.jpeg", w: 1024, h: 1024, when: "Nov" },
      { src: "/gallery/nov-how-it-feels.jpeg", w: 1024, h: 1024, when: "Nov" },
    ],
  },
  {
    trend: "Indian brands going abroad",
    brand: "Bira 91",
    leap:
      "It read the export story in the business press and turned it into a travel series, planting the same bottle in a different skyline each time.",
    shots: [
      { src: "/gallery/sept-bira-two-landmarks.jpeg", w: 512, h: 512, when: "Sept" },
      { src: "/gallery/oct-bira-america.jpeg", w: 512, h: 512, when: "Oct" },
    ],
  },
  {
    trend: "Basketball season",
    brand: "Nike",
    leap:
      "A different category entirely. It went for shallow depth of field on the product with the athlete deliberately out of focus behind, which is how that category actually shoots.",
    shots: [
      { src: "/gallery/oct-lebron-spec-sheet.jpeg", w: 400, h: 400, when: "Oct" },
      { src: "/gallery/nov-lebron-confetti.jpeg", w: 844, h: 844, when: "Nov" },
      { src: "/gallery/nov-empty-gym.jpeg", w: 340, h: 340, when: "Nov" },
    ],
  },
];

// Why we started and why it stopped. Written plainly, on purpose.
export const ambition = [
  {
    n: "01",
    title: "The posts were never the point",
    body: "Zyke was the first step toward a content pipeline that ran itself. Not a tool you open and prompt every morning, but an engine that knew a brand well enough to keep producing for it without being asked.",
  },
  {
    n: "02",
    title: "Two engines were supposed to do that",
    body: "A trend engine that watched what was happening and decided what was worth reacting to. And a brand engine that went and read everything: hundreds of pages of a company's own site, its whole back catalogue of posts, how it styles its images, who it talks to, what it has already said. Not a prompt describing a brand. A researched model of one.",
  },
  {
    n: "03",
    title: "The far end of it was not marketing",
    body: "Once you can generate on-brand images and video from a researched model of a style, marketing is only the easiest customer. The same machinery points at entertainment. Something in the shape of what Higgsfield is doing now for generated video, with a trend engine and a brand research engine bolted on the front. That was the direction, and we were nowhere near it.",
  },
  {
    n: "04",
    title: "And I wanted to build something",
    body: "Honestly, that is half the answer. I came into college too techy and too ambitious to sit still. I wanted to ship things, start a company, hack on hard problems and have fun doing it. Zyke was that as much as it was a business.",
  },
];

export const failure = [
  "We did not reach out enough. We should have been in front of brands every week. We were not.",
  "We never properly understood what a marketing team needs day to day. We did not do enough customer research, so most decisions came out of our own guesses.",
  "We could not sell. There was a working product and a demo people liked, and nothing behind it.",
  "We never got real pilots running. A few companies tried it. That is not the same as one brand using it every week and telling you what is broken.",
  "Everything we were good at sat on one side of the business. The other side stayed empty.",
];

export const failureClose =
  "Then there were co-founder disputes, and with the outreach already stalled there was not much holding it together. It ended there. I was in my third year and left for an internship. The lesson is not subtle: building the hard part turned out not to be the hard part.";

// ---------------------------------------------------------------------------
// The two engines worth describing in detail: the trend recommender, and the
// image editing router. The recommender is all in the archived backend. The
// editing router mostly ran as a separate GPU service whose source is not in
// these repos, so that part is written from memory and from the calls the
// frontend made into it.
// ---------------------------------------------------------------------------

export const recommender = [
  {
    n: "1",
    title: "Pull what the country is actually searching",
    body: "Google Trends daily trending searches for India, through pytrends, on an IST clock. Not a hashtag scrape. The queries people were typing that morning.",
  },
  {
    n: "2",
    title: "Ask why each one is trending",
    body: "A trending search on its own is a noun with no story. Every trend went to Perplexity with one job: explain why this is trending right now, not what it is in general, and if there are several reasons give all of them. It came back as a one-line summary and a long description. That distinction mattered, because a brand cannot react to a topic, only to a reason.",
  },
  {
    n: "3",
    title: "Score every trend against the brand",
    body: "The scorer received three things: the company research database, an analysis of the brand's own historical posts, and the full trend list with explanations. It returned a relevance score from 1 to 10 for each trend and a ranking, along with the trend's original position so the ranking could be mapped back to the source list.",
  },
  {
    n: "4",
    title: "Score differently depending on the brand",
    body: "This is the part that made it feel personal. The instruction split brands in two. A brand whose history showed it was creative and willing to be strange got encouraged toward unconventional ideas even from trends with nothing to do with its sector. A traditional brand got directly related, conventional ideas and was actively discouraged from the leaps. The same trend list handed to two brands came back ranked differently and used differently.",
  },
  {
    n: "5",
    title: "Turn the ranked trends into ideas, not posts",
    body: "For each trend that scored well it produced several named ideas with descriptions, still in the brand's voice, and stopped there. You saw the ranking, the reasoning and the ideas, and chose. There was also a checkbox that let it add one idea of its own that you had not asked for, which is where a good deal of the stranger output on this page came from.",
  },
  {
    n: "6",
    title: "Cache it, and do not charge for it",
    body: "Trends were cached globally for six hours and a user's ranked ideas for six hours more, so the expensive part ran once rather than once per visit. The cost of fetching and explaining trends was logged against a house account instead of the user's credits, because nobody should pay to find out what is happening.",
  },
];

export const editing = [
  {
    n: "1",
    title: "A model decides what kind of edit this is",
    body: "You typed a sentence. Before anything touched the picture, the image and the available workflows went to o1-mini, which decided what you actually wanted and called the tools to do it. Change the whole mood, replace one object, delete one object, restyle the entire image: these are four different pipelines with different failure modes, and picking the wrong one produces garbage. The router picked, triggered the workflow and managed it through to the end.",
  },
  {
    n: "2",
    title: "Route one: click to segment, at the granularity you meant",
    body: "If you pointed at something, one click went to a granularity-controllable interactive segmentation model, GraCo, in the same family as Semantic SAM. A single click is ambiguous by nature: clicking a rider's jacket could mean the jacket, the rider, or the rider and the scooter together. So it returned several masks at several granularities for that one click, and you picked the one that matched what you meant. That region was then cut out of the image and refilled, either by infill or by image to image on the masked area.",
  },
  {
    n: "3",
    title: "Route two: no target, so change everything",
    body: "A prompt about the whole picture, like making the background darker, has no object to find. That went straight to image to image over the full frame with your sentence as the instruction, which keeps the composition and moves the look.",
  },
  {
    n: "4",
    title: "Route three: find the thing you named",
    body: "If your sentence named an object rather than pointing at one, an open-vocabulary detector took over. Grounding DINO was given the noun phrase from your prompt and returned candidate regions for it. The most related one was selected, converted to a mask, and then operated on. Modify meant image to image inside that mask. Remove meant infill, so the model had to invent what belonged behind the thing that was deleted rather than smearing it.",
  },
  {
    n: "5",
    title: "Route four: restyle the whole thing with a LoRA",
    body: "Asking for a different look is not an edit to a region, it is an edit to everything at once. We kept a set of styling LoRAs, and a style request triggered the matching one and re-rendered the image through it. Prompt-only restyling in 2024 tended to redraw the picture into something else; a LoRA held the content and moved the treatment.",
  },
  {
    n: "6",
    title: "Show the mask before spending anything",
    body: "Masks are unreadable as raw arrays, so each candidate was dilated with a seventeen by seventeen kernel, resized to the picture and alpha-blended over it in colour. You chose from a row of previews of your own image with the region lit up. That step ran locally with OpenCV and cost nothing, so you could hunt for the right region for free and only pay when you committed.",
  },
  {
    n: "7",
    title: "Always edit the original, never the last result",
    body: "Every operation was applied to the pristine image rather than to the previous edit, with the whole chain kept as history you could step back through. Repeated edits in 2024 degraded fast, each pass softening and shifting what the one before it had done. Going back to the original each time is why five edits still looked like one picture.",
  },
  {
    n: "8",
    title: "Fight the inpainting model into blending",
    body: "Infill liked to hand back a half-filled hole, a hard seam, or a caption written into the gap. So the instruction was wrapped in a fixed demand to blend the region with the rest of the image and fill it completely, plus a long negative prompt listing every failure we had seen: empty part, blank image, text, any text, alphabets, part not blended with the rest.",
  },
];

// Every collapsible section, in page order. Drives the nav and the contents list.
export const sections = [
  { id: "demo", n: "01", label: "The demo", blurb: "Four minutes, from a blank brand to edited posts." },
  { id: "problem", n: "02", label: "The problem", blurb: "Why we started building it at all." },
  { id: "pillars", n: "03", label: "The promise", blurb: "Three claims, and the comparison behind them." },
  { id: "how", n: "04", label: "How it worked", blurb: "One brand, one trend, nine posts, one edit." },
  { id: "features", n: "05", label: "Features", blurb: "Thirteen things it did." },
  { id: "gallery", n: "06", label: "What it made", blurb: "Three months of output, and how fast it improved." },
  { id: "buyers", n: "07", label: "Who it was for", blurb: "Three company sizes, in their own words." },
  { id: "numbers", n: "08", label: "The numbers", blurb: "Unit economics, and the market we never reached." },
  { id: "stack", n: "09", label: "Under the hood", blurb: "The trend recommender and the editing router, in full." },
  { id: "story", n: "10", label: "The story", blurb: "Five months, three people, fifty thousand in credits." },
  { id: "why", n: "11", label: "Why", blurb: "What we were building, and why it stopped." },
];
