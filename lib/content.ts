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
  { name: "Tasmay P. Tibrewal" },
  { name: "Rupam Mahato" },
  { name: "Siddharth Dikshit" },
];

export const grants = [
  { org: "Daytona", amount: "$10,000", what: "Development environment credits" },
  { org: "CampusFund", amount: "$5,000", what: "AWS credits to build the MVP" },
  { org: "Modal Labs", amount: "$5,000", what: "Compute credits to deploy the ML models" },
  { org: "Google Cloud for Startups", amount: "$2,000", what: "Credits for the GPU segmentation service and storage" },
  { org: "Microsoft for Startups", amount: "$1,000", what: "Azure credits" },
  { org: "MongoDB for Startups", amount: "$500", what: "Database credits" },
];

// ---------------------------------------------------------------------------
// Work Zyke produced during testing, for Zomato, Bira 91 and one other brand.
// We did not write these. Zyke picked the trend, decided how to tie it to the
// brand, wrote the caption and generated the picture. Grouped the way it made
// them: by brand, then by the trend it latched onto.
//
// `w` is the generated width. It doubles as a date stamp. The 512px runs are
// the earliest, 1024px came after we rebuilt the pipeline, and the 1600px ones
// are from the last builds in November 2024.
// ---------------------------------------------------------------------------

export type Piece = {
  src: string;
  w: number;
  h: number;
  caption: string;
};

export type TrendGroup = {
  id: string;
  trend: string;
  when: string;
  leap: string;
  pieces: Piece[];
};

export type BrandGroup = {
  brand: string;
  note: string;
  groups: TrendGroup[];
};

export const work: BrandGroup[] = [
  {
    brand: "Zomato",
    note:
      "An Indian food delivery company with famously cheeky marketing. We gave Zyke the name and the website. Everything after that is its own.",
    groups: [
      {
        id: "pm",
        trend: "The Prime Minister was all over the Indian news",
        when: "November 2024",
        leap:
          "Zyke read the domestic news cycle, saw one name in most of it, and decided the move was a national endorsement. Nobody asked it for a politician. It reached for the most recognisable face in the country and put a delivery box in his hands. These two are also the sharpest pictures it ever made.",
        pieces: [
          { src: "/gallery/scaling-new-heights.jpeg", w: 1600, h: 1066, caption: "A mountain of food on a mountain, a very large box, and an unmistakable endorsement." },
          { src: "/gallery/better-food-for-more-people.jpeg", w: 1600, h: 1066, caption: "A chef's hat, a floating buffet, and four cartoon cows carrying Zomato bags." },
        ],
      },
      {
        id: "delhi",
        trend: "Delhi traffic",
        when: "October 2024",
        leap:
          "The least exotic trend it ever picked, and the one closest to the actual product. If the city cannot move, the interesting thing about a delivery company is that its riders still do.",
        pieces: [
          { src: "/gallery/delhi-landmarks.jpeg", w: 1024, h: 1024, caption: "A red scooter throwing sparks past India Gate at sunset." },
          { src: "/gallery/smart-routing-at-night.jpeg", w: 1024, h: 1024, caption: "A glowing scooter tracing a lit route across a dark city map." },
          { src: "/gallery/how-it-feels-vs-how-it-delivers.jpeg", w: 1024, h: 1024, caption: "Gridlock on top, a rider getting through underneath." },
          { src: "/gallery/not-for-our-delivery-heroes.jpeg", w: 1024, h: 1024, caption: "Stuck in traffic, then the same rider on a rocket." },
        ],
      },
      {
        id: "grwm",
        trend: "Get-ready-with-me videos",
        when: "October 2024",
        leap:
          "A format, not an event. Zyke noticed the shape of the videos doing well that week and rebuilt it around food, so the products in the routine are all things you order.",
        pieces: [
          { src: "/gallery/zomato-twist-makeup.jpeg", w: 1024, h: 1024, caption: "A four-panel get-ready-with-me where every product is a food container." },
          { src: "/gallery/eat-light-shine-bright.jpeg", w: 1024, h: 1024, caption: "A beauty collage in purple: skin, a box, and dinner under a full moon." },
        ],
      },
      {
        id: "ufo",
        trend: "The US government released its files on unidentified objects",
        when: "September 2024",
        leap:
          "This is the jump we did not see coming. Declassified alien files were the story of the week, so Zyke decided that if aliens are real then they are a market, and started writing posts about serving them. The asteroid fries and the galaxy sauce are its words, not ours.",
        pieces: [
          { src: "/gallery/aliens-order-fries.jpeg", w: 512, h: 512, caption: "Four aliens at a table in orbit, arguing over asteroid fries and galaxy sauce." },
          { src: "/gallery/alien-chef-in-orbit.jpeg", w: 512, h: 512, caption: "A green chef plating a salad in a space station kitchen, Earth through the window." },
          { src: "/gallery/zomato-delivers-to-the-roof.jpeg", w: 512, h: 512, caption: "A delivery jet banking over a moonlit rooftop dinner, guests slightly not from here." },
        ],
      },
      {
        id: "spacex",
        trend: "SpaceX caught a Starship booster with the launch tower",
        when: "October 2024",
        leap:
          "The trend everyone was posting about. Zyke's angle was that catching a hundred-tonne booster and getting an order right are the same claim about precision, so it built the comparison out until it had a chart of it.",
        pieces: [
          { src: "/gallery/spacex-vs-zomato-precision.jpeg", w: 512, h: 512, caption: "A rocket launch beside a delivery rider. Same precision, different missions." },
          { src: "/gallery/booster-catch-rate-chart.jpeg", w: 512, h: 512, caption: "A bar chart nobody asked for, comparing booster recovery to order accuracy." },
          { src: "/gallery/flag-on-an-on-time-delivery.jpeg", w: 512, h: 512, caption: "An astronaut planting a flag in deep space, holding an open pizza box." },
          { src: "/gallery/zomato-to-the-moon.jpeg", w: 512, h: 512, caption: "An astronaut walking the lunar surface with a pizza." },
        ],
      },
    ],
  },
  {
    brand: "Bira 91",
    note:
      "An Indian craft beer company, and one of the companies that actually tested Zyke in November 2024.",
    groups: [
      {
        id: "diwali",
        trend: "Diwali",
        when: "October 2024",
        leap:
          "The obvious one, handled well. Zyke went for the room rather than the product: lights, a crowded table, people mid-laugh.",
        pieces: [
          { src: "/gallery/bira-diwali-cheers.jpeg", w: 512, h: 512, caption: "Two glasses meeting in front of a blurred rangoli of light." },
          { src: "/gallery/one-bira-table.jpeg", w: 512, h: 512, caption: "Shot from above: a dozen hands and a logo burned into the wood." },
          { src: "/gallery/bira-at-the-party.jpeg", w: 512, h: 512, caption: "A crowd mid-laugh in headscarves and gold, glasses raised." },
        ],
      },
      {
        id: "global",
        trend: "Indian brands going abroad",
        when: "October 2024",
        leap:
          "Zyke read the export story in the business press and turned it into a travel series, planting the bottle in a different skyline each time.",
        pieces: [
          { src: "/gallery/bira-takes-the-world.jpeg", w: 512, h: 512, caption: "One bottle standing between the Statue of Liberty and the Eiffel Tower." },
          { src: "/gallery/bira-lands-in-america.jpeg", w: 512, h: 512, caption: "Six bottles on a Stars and Stripes, lit like a product shoot." },
          { src: "/gallery/bira-in-every-skyline.jpeg", w: 512, h: 512, caption: "Big Ben, a dome, a bridge, and a crowd raising bottles underneath." },
        ],
      },
      {
        id: "nobrand",
        trend: "No trend, just the brand",
        when: "October 2024",
        leap:
          "With nothing trending it fell back on the brand voice alone. The second one is Zyke arguing with a stereotype about its own category, which is not a thing we asked it to do.",
        pieces: [
          { src: "/gallery/bira-under-the-tree.jpeg", w: 512, h: 512, caption: "A quiet table under an enormous oak, low sun through the leaves." },
          { src: "/gallery/is-beer-only-for-men.jpeg", w: 512, h: 512, caption: "Myth on the left in navy, fact on the right in yellow, and a crowd disagreeing." },
        ],
      },
    ],
  },
  {
    brand: "A coding school",
    note: "A third brand we pointed it at to see whether any of this held up outside food and drink.",
    groups: [
      {
        id: "dev",
        trend: "Developer culture",
        when: "October 2024",
        leap:
          "Different category, same behaviour. It found the running joke in the audience and built a mascot around it without being told there should be one.",
        pieces: [
          { src: "/gallery/brewing-the-perfect-code.jpeg", w: 512, h: 512, caption: "Half brewery, half IDE, one chimp holding the sign between them." },
          { src: "/gallery/six-months-to-mastery.jpeg", w: 512, h: 512, caption: "A chimp in a leather jacket with a pint in one hand and a textbook in the other." },
        ],
      },
    ],
  },
];

// The same pipeline, three months apart. Used to show what got better.
export const progression = [
  {
    when: "September 2024",
    size: "512 x 512",
    src: "/gallery/aliens-order-fries.jpeg",
    w: 512,
    h: 512,
    what: "Composition works, text does not. Speech bubbles come out as approximate shapes: \u201cPass the galax yon galaxy sauce\u201d. One megapixel was the ceiling.",
  },
  {
    when: "October 2024",
    size: "1024 x 1024",
    src: "/gallery/delhi-landmarks.jpeg",
    w: 1024,
    h: 1024,
    what: "Four times the pixels after we moved to FLUX 1.1 Pro and started writing image prompts through the brand voice. Headlines are nearly right; \u201cthrowgth\u201d is the only slip.",
  },
  {
    when: "November 2024",
    size: "1600 x 1066",
    src: "/gallery/scaling-new-heights.jpeg",
    w: 1600,
    h: 1066,
    what: "The last builds. Near-photographic, a readable headline, a hashtag it invented, and a face it rendered on purpose. Still cannot spell Zomato on the box.",
  },
];

// ---------------------------------------------------------------------------
// The image pipeline, and the things we had to build ourselves because they
// did not exist yet. All taken from the code.
// ---------------------------------------------------------------------------

export const era2024 = [
  "There was no Nano Banana and no GPT Image. There was no model you could hand a picture and a sentence to and get the picture back, changed.",
  "Image models could not write. Any text in a picture came out as approximate letter shapes, which is why almost every headline on this page is misspelled.",
  "A megapixel was the ceiling. 1024 by 1024 was a good day.",
  "Instruction following was weak. A long prompt with several requirements in it would get two of them.",
  "Nothing kept a character or a product consistent between two pictures, so a set of images that told one story had to be forced.",
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
    body: "FLUX 1.1 Pro through Together AI, 1024 square, fifty steps, at four and a bit cents an image. Requests went out in batches of four with a pause between them to stay inside the rate limit, then every image was downloaded and inlined so a post travelled as one object.",
  },
  {
    n: "4",
    title: "Click a point, get candidate regions",
    body: "The part that did not exist anywhere else. You clicked a pixel. Those coordinates went to a semantic segmentation model we ran on a GPU behind Google Cloud Run, which returned several candidate masks for what you might have meant, from the object you clicked to the whole region around it.",
  },
  {
    n: "5",
    title: "Show the masks before committing",
    body: "Raw masks are unreadable, so each one was dilated with a seventeen by seventeen kernel, resized to the picture and alpha-blended over it in colour. You picked from a row of previews of your own image with the region lit up. Choosing a region cost nothing, because that step ran locally with OpenCV.",
  },
  {
    n: "6",
    title: "Repaint only that region",
    body: "The chosen mask, the original picture and your sentence went to Stability's inpainting endpoint at three cents a call. Every edit was applied to the pristine original rather than the last edit, so mistakes did not compound, and the whole chain was kept as history you could step back through.",
  },
  {
    n: "7",
    title: "Fight the model into blending",
    body: "Inpainting in 2024 liked to return a half-filled hole, or a hard seam, or to write a caption into the gap. So the prompt was wrapped in a fixed instruction to blend the region with the rest of the image and fill it completely, plus a long negative prompt listing every failure we had seen: empty part, blank image, text, any text, alphabets, part not blended with the rest.",
  },
];

export const novelties = [
  "Editing a generated image by pointing at it and describing the change, a year before any image model could do it on its own.",
  "Candidate masks shown as previews on your own picture, so a segmentation model became something a marketing person could use.",
  "Always editing the original rather than the last result, with full undo history.",
  "A brand voice as a stored object passed into every prompt, rather than a prompt template.",
  "Trend, idea and post as three separate stages you could stop and steer between, each one parsed from tagged output.",
  "Every generation metered to the cent, because credits were deducted per model call.",
];
