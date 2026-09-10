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
  { name: "Siddharth Dikshit", role: "Chief Executive Officer" },
  { name: "Tasmay P. Tibrewal", role: "Chief Technical Officer" },
];

export const grants = [
  { org: "CampusFund", amount: "$5,000", what: "AWS credits to build the MVP" },
  { org: "Modal Labs", amount: "$5,000", what: "Compute credits to deploy the ML models" },
  { org: "Microsoft for Startups", amount: "$1,000", what: "Azure credits" },
  { org: "MongoDB for Startups", amount: "$500", what: "Database credits" },
];

// ---------------------------------------------------------------------------
// Work Zyke produced during testing, for Zomato, Bira 91 and a couple of other
// brands. We did not write these prompts. Zyke picked the trend, tied it to the
// brand and wrote the caption. The `prompt` line below is our best guess at the
// half-sentence idea behind each one, recovered by looking at the picture. The
// originals are gone.
// ---------------------------------------------------------------------------

export type Piece = {
  src: string;
  w: number;
  h: number;
  brand: string;
  trend: string;
  prompt: string;
  caption: string;
  featured?: boolean;
};

export const wild: Piece[] = [
  { src: "/gallery/spacex-vs-zomato-precision.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "SpaceX catches a booster, Zomato catches your craving", caption: "A rocket launch beside a delivery rider. Same precision, different missions.", featured: true },
  { src: "/gallery/rider-leaves-the-planet.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "a Zomato rider leaving the planet", caption: "A rider lifting off Earth on a pizza-fuelled exhaust trail, past pizza planets.", featured: true },
  { src: "/gallery/booster-catch-rate-chart.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "booster success rate vs order accuracy rate", caption: "A bar chart nobody asked for, comparing rocket recovery to getting your order right.", featured: true },
  { src: "/gallery/aliens-order-fries.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "aliens ordering fries from Zomato", caption: "Four aliens at a table in orbit, arguing over asteroid fries and galaxy sauce.", featured: true },
  { src: "/gallery/alien-chef-in-orbit.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "an alien chef cooking Zomato food in orbit", caption: "A green chef plating a salad in a space station kitchen, Earth through the window.", featured: true },
  { src: "/gallery/zomato-delivers-to-the-roof.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "Zomato delivers to the rooftop, aliens included", caption: "A Zomato jet banking over a moonlit rooftop dinner, guests slightly not from here.", featured: true },
  { src: "/gallery/flag-on-an-on-time-delivery.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "planting a flag on an on-time delivery", caption: "An astronaut planting a red flag in deep space, holding an open pizza box." },
  { src: "/gallery/zomato-to-the-moon.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "Zomato to the moon", caption: "An astronaut walking the lunar surface with a pizza, hashtagged #MartianMeals." },
  { src: "/gallery/mission-control-fleet.jpeg", w: 512, h: 512, brand: "Zomato", trend: "SpaceX catches a Starship booster", prompt: "the Zomato mission control fleet", caption: "Four riders in spacesuits on scooters, rolling out of a command centre." },

  { src: "/gallery/delhi-landmarks.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", prompt: "a rider tearing past Delhi's landmarks", caption: "A red scooter throwing sparks past India Gate at sunset, petals in the air.", featured: true },
  { src: "/gallery/smart-routing-at-night.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", prompt: "Zomato's smart routing, at night", caption: "A glowing scooter tracing a lit route across a dark city map.", featured: true },
  { src: "/gallery/how-it-feels-vs-how-it-delivers.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", prompt: "Delhi traffic versus a Zomato rider", caption: "Gridlock on top, a rider getting through underneath. How it feels, versus how it delivers." },
  { src: "/gallery/not-for-our-delivery-heroes.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Delhi traffic", prompt: "stuck in traffic, except our riders", caption: "Two panels: a rider weaving through cars, then the same rider on a rocket." },
  { src: "/gallery/three-steps.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "none", prompt: "the three steps of a delivery", caption: "Get the order, plan the route, deliver. Three cards, one dark palette." },

  { src: "/gallery/scaling-new-heights.jpeg", w: 1600, h: 1066, brand: "Zomato", trend: "The Prime Minister in the news", prompt: "what if the Prime Minister endorsed Zomato?", caption: "A mountain of food, a very large delivery box, and an unmistakable endorsement.", featured: true },
  { src: "/gallery/better-food-for-more-people.jpeg", w: 1600, h: 1066, brand: "Zomato", trend: "The Prime Minister in the news", prompt: "the Prime Minister as Zomato's chef, and the cows agree", caption: "A chef's hat, a floating buffet, and four cartoon cows holding Zomato bags." },

  { src: "/gallery/zomato-twist-makeup.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Get-ready-with-me videos", prompt: "a Zomato makeup tutorial", caption: "A four-panel get-ready-with-me, except every product is a food container." },
  { src: "/gallery/eat-light-shine-bright.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Get-ready-with-me videos", prompt: "eat light, shine bright", caption: "A beauty collage in purple: skin, a Zomato box, and dinner under a full moon." },
  { src: "/gallery/order-as-a-beauty-boost.jpeg", w: 1024, h: 1024, brand: "Zomato", trend: "Get-ready-with-me videos", prompt: "your Zomato order as a beauty boost", caption: "Before and after, in full bridal makeup, credited to a food delivery order." },

  { src: "/gallery/bira-diwali-cheers.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Diwali", prompt: "Bira 91 for Diwali", caption: "Two glasses meeting in front of a blurred rangoli of light.", featured: true },
  { src: "/gallery/one-bira-table.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Diwali", prompt: "everyone around one Bira 91 table", caption: "Shot from above: a dozen hands, a glowing logo burned into the wood.", featured: true },
  { src: "/gallery/bira-dinner-party.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Diwali", prompt: "a Bira 91 dinner party", caption: "A long table, warm lights, everyone reaching in at once." },
  { src: "/gallery/bira-at-the-party.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Diwali", prompt: "Bira 91 at the party", caption: "A crowd mid-laugh in headscarves and gold, glasses raised." },
  { src: "/gallery/bira-under-the-tree.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "Bira 91 under a tree at golden hour", caption: "A quiet table under an enormous oak, low sun through the leaves.", featured: true },
  { src: "/gallery/bira-takes-the-world.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "Bira 91 takes on the world", caption: "One bottle standing between the Statue of Liberty and the Eiffel Tower.", featured: true },
  { src: "/gallery/bira-new-york-rooftop.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "Bira 91 on a New York rooftop", caption: "Golden hour over Manhattan, six people and a round of bottles." },
  { src: "/gallery/bira-garden-party.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "a Bira 91 garden party", caption: "Paper lanterns, a checked tablecloth, and a table of people laughing." },
  { src: "/gallery/bira-lands-in-america.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "Bira 91 lands in America", caption: "Six bottles on a Stars and Stripes, lit like a product shoot." },
  { src: "/gallery/bira-in-every-skyline.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "Going global", prompt: "Bira 91 in every skyline", caption: "Big Ben, a dome, a bridge, and a crowd raising bottles underneath." },
  { src: "/gallery/bira-citrus.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "none", prompt: "Bira 91, citrus and smooth", caption: "A split product shot: pineapple and shade on one side, hard orange on the other." },
  { src: "/gallery/is-beer-only-for-men.jpeg", w: 512, h: 512, brand: "Bira 91", trend: "none", prompt: "is beer only for men?", caption: "Myth on the left in navy, fact on the right in yellow, and a crowd disagreeing." },

  { src: "/gallery/brewing-the-perfect-code.jpeg", w: 512, h: 512, brand: "Others", trend: "Developer culture", prompt: "brewing the perfect code", caption: "Half brewery, half IDE, one chimp holding the sign between them.", featured: true },
  { src: "/gallery/six-months-to-mastery.jpeg", w: 512, h: 512, brand: "Others", trend: "Developer culture", prompt: "six months to mastery", caption: "A chimp in a leather jacket with a pint in one hand and a textbook in the other." },
];

export const brandFilters = ["All", "Zomato", "Bira 91", "Others"];
