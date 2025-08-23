# Zyke Frontend — Codebase Documentation

Deep, implementation-level documentation for the Zyke Next.js 14 frontend. This guide covers architecture, auth/session, routing, data flow, core features, component and function internals, API contracts, configuration, extension points, and operational notes.

Conventions
- Source references use clickable links. Functions or declarations include the exact line for quick navigation, e.g., [TypeScript.RootLayout()](zyke-frontend/app/layout.tsx:22). File links may omit the line number, e.g., [zyke-frontend/app/page.tsx](zyke-frontend/app/page.tsx).

Contents
- Architecture and runtime overview
- Authentication and session lifecycle
- Route protection and brand-voice gating
- Feature flows
  - Idea generation (trend/repurpose/custom) and navigation
  - Generated ideas → post generation
  - Generated posts visualization and image editing (segment, blend, inpaint)
  - Payments and credits
- Component and function deep dive
- Hooks and utilities
- API contracts and payloads
- Configuration and environment
- Error handling and operational notes
- Extension guide
- Route matrix
- Appendix: Types and interfaces


## Architecture and runtime overview

- Framework: Next.js 14 (App Router, RSC), React 18, TypeScript
- Styling/UI: Tailwind CSS, shadcn/ui, Framer Motion, React Spring
- Auth: next-auth with JWT strategy (Google OAuth and Credentials), backend-issued tokens
- Payments: Razorpay web SDK; order lifecycle through backend
- Storage: Primarily volatile client state; posts bundle fetched from backend
- Backend integration: Flask services (secured with Bearer tokens) using fetch/axios

App shell
- [TypeScript.RootLayout()](zyke-frontend/app/layout.tsx:22) defines metadata and loads local fonts, wraps all children in session context via [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7).
- Marketing landing at [zyke-frontend/app/page.tsx](zyke-frontend/app/page.tsx) renders [TypeScript.HomePage()](zyke-frontend/components/HomePage.tsx:36).

Auth API route
- [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14) drives provider setup, JWT lifecycle (refresh), session mapping, and redirect behavior.


## Authentication and session lifecycle

Providers
- Google OAuth: sign-in callback branch exchanges Google profile (providerAccountId) to backend [TypeScript.signIn()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:68), POST /auth/oauth/callback, then saves tokens to user object to populate JWT.
- Credentials: [TypeScript.authorize()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:32) POSTs to /auth/login with email/password; on success maps backend user + tokens into the session.

JWT and silent refresh
- [TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101)
  - On first pass, attaches accessToken, refreshToken, id, and may set accessTokenExpiresAt.
  - If access token is expired, POSTs /auth/refresh to obtain a new access_token and updates accessToken and expiry.
- [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) exposes accessToken, refreshToken, and user.id on the session for client use.

Session provider
- [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7) provides next-auth SessionProvider with refetchInterval=5m and refetchOnWindowFocus=true to keep client session fresh.

Redirects and pages
- [TypeScript.redirect()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:136) returns baseUrl + "/idea-generator" post-login.
- Custom sign-in page configured at /signin, rendered by [zyke-frontend/app/signin/page.tsx](zyke-frontend/app/signin/page.tsx) which loads [TypeScript.SignIn()](zyke-frontend/components/authentication/Signin.tsx:22).


## Route protection and brand-voice gating

Guard component
- [TypeScript.ProtectedRoute()](zyke-frontend/components/ProtectedRoute.tsx:14)
  - If not authenticated, redirects to /signin.
  - If requireBrandVoice is true, fetches /brand_voice_info/profile (bearer session.accessToken) to verify user has a brand voice; otherwise redirects to /user-type.
  - Shows [TypeScript.LoaderSpinner()](zyke-frontend/components/LoaderSpinner.tsx:1) while checking.

Usage
- Idea Generator: [zyke-frontend/app/idea-generator/page.tsx](zyke-frontend/app/idea-generator/page.tsx) wraps [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326) with requireBrandVoice.
- Generated Ideas: [zyke-frontend/app/generated-ideas/page.tsx](zyke-frontend/app/generated-ideas/page.tsx) wraps [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52) with requireBrandVoice.
- Generated Posts: [zyke-frontend/app/generated-posts/page.tsx](zyke-frontend/app/generated-posts/page.tsx) wraps [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777) with requireBrandVoice.
- Brand Profile: [zyke-frontend/app/brandprofile/page.tsx](zyke-frontend/app/brandprofile/page.tsx) wraps [TypeScript.BrandProfile()](zyke-frontend/components/BrandProfile.tsx:82) with requireBrandVoice.
- Brand Voice Creation: [zyke-frontend/app/brandvoice/page.tsx](zyke-frontend/app/brandvoice/page.tsx) wraps [TypeScript.BrandVoiceCreator()](zyke-frontend/components/BrandVoice.tsx:164) without the requireBrandVoice constraint.


## Feature flows

### Idea generation (trend, repurpose, custom)

Entry
- Users who are authenticated and have a brand voice are routed to [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326).

Navbar behavior
- Animated, scroll-aware navbar inlined in the file: [TypeScript.LegendaryNavbar()](zyke-frontend/components/IdeaGenerator.tsx:145).
- Scroll direction detected via [TypeScript.useScrollDirection()](zyke-frontend/components/IdeaGenerator.tsx:92).

Trend flow
- [TypeScript.fetchTrendsAndIdeas()](zyke-frontend/components/IdeaGenerator.tsx:359)
  - GET /trends/fetch_trends (requires Authorization: Bearer <accessToken>)
  - POST /trend_to_idea/generate_ideas with payload: { use: "trend", text: trendsData.trends } (nested list passed verbatim)
  - Transforms backend object response into combined Trend[] with relevance sorting.

Repurpose flow (URL inputs)
- [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484) with content type mapping:
  - blog → "blog", instagram_post → "post", reel → "reel", news_article → "news-article", youtube_video → "yt-video", website → "website".
  - POST /repurpose/repurpose_url { url, content_type } → returns { topic, summary, description }.
  - Then POST /trend_to_idea/generate_ideas with { use: "topic", text: { topic, summary, description } }.

Custom topic
- [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484) for contentType === "custom_topic":
  - POST /trend_to_idea/generate_ideas with { use: "manual", text: { name, description } }.

Navigation to Generated Ideas
- All three flows eventually produce dataToSend: { name: string, ideas: string[][] }.
- This object is serialized and encoded into a query param, then navigates to /generated-ideas.

### Generated ideas → generated posts

Ideas view and selection
- [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52) parses the serialized payload and constructs Idea[] with id, title, content, type.
- Supports:
  - Selecting multiple ideas (or a “Custom Idea”)
  - Posts per idea (1..5)
  - Optional include of one AI-generated idea
  - Platform selection (instagram | linkedin)

Post generation
- [TypeScript.handleGenerateContent()](zyke-frontend/components/GeneratedIdeas.tsx:158)
  - Validates selections and constructs payload: { ideas: [ [title, content], ... ], num, platform }
  - POST /idea_to_post/fetch_posts → expects { saved: true } to route forward.
  - On success, navigates to /generated-posts.

### Generated posts visualization and image editing

Load latest posts
- [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777) POSTs to /fetch_last_post/get_stored_post using session.accessToken to load the latest generated content.
- Transforms into a map by idea: Post[] where Post = { caption, images }.

Per-image modal editor
- [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61) is a fully featured modal for per-image editing.
  - Selection: click “Select Point for Masking” on the original image to choose a mask seed.
  - Segmentation: [TypeScript.handleImageClick()](zyke-frontend/components/GeneratedPosts.tsx:117) sends proportional coordinates with base64 of the original image to external segmentation service POST https://click-segment-new-617792710458.asia-southeast1.run.app/segment; receives masks.
  - Blending: POST /blend/blend_masks with { masks, img: base64 } → returns blended_images[] and dilated_masks[]; modal pairs them and shows thumbnails.
  - Select a mask: [TypeScript.handleMaskSelection()](zyke-frontend/components/GeneratedPosts.tsx:257) chooses a blended image and sets the selected dilated mask.
  - Inpaint: [TypeScript.handleGenerate()](zyke-frontend/components/GeneratedPosts.tsx:386) POSTs /inpaint/inpaint_image with { prompt or "", remove: "true"|"false", mask, image: base64 } and updates image history.
  - Helpers: [TypeScript.convertImageToBase64()](zyke-frontend/components/GeneratedPosts.tsx:102), history navigation ([TypeScript.handleRevert()](zyke-frontend/components/GeneratedPosts.tsx:295), [TypeScript.handlePrevImage()](zyke-frontend/components/GeneratedPosts.tsx:308), [TypeScript.handleNextImage()](zyke-frontend/components/GeneratedPosts.tsx:319)), selection toggles ([TypeScript.activateSelectMask()](zyke-frontend/components/GeneratedPosts.tsx:281), [TypeScript.cancelSelectMask()](zyke-frontend/components/GeneratedPosts.tsx:288)).

Export and caption
- [TypeScript.handleExportPost()](zyke-frontend/components/GeneratedPosts.tsx:1031) zips caption.txt and images (works with both URL and base64) and triggers download.
- “Copy caption” utility for easy reuse of text content.

### Payments and credits

Credits dashboard
- [TypeScript.Component()](zyke-frontend/components/payment/Credits.tsx:53) displays user information, credits balance, and transaction history.
- Queries:
  - GET /transactions/user → loads basic user profile, including is_admin flag.
  - GET /transactions/credits → loads current credits.
  - GET /transactions/history → transaction list for the logged-in user.
  - GET /transactions/history/:userId → admin-only transaction history by user.

Add credits flow
- [TypeScript.handleAddCredits()](zyke-frontend/components/payment/Credits.tsx:210) orchestrates:
  - Creates order via POST /transactions/add with { amount, currency }
  - Initializes Razorpay with [TypeScript.initializeRazorpay()](zyke-frontend/components/payment/Credits.tsx:374)
  - Opens checkout via [TypeScript.makePayment()](zyke-frontend/components/payment/Credits.tsx:241)
  - On handler success, alerts and refreshes balance


## Component and function deep dive

Layout and shell
- [TypeScript.RootLayout()](zyke-frontend/app/layout.tsx:22)
  - Configures metadata, loads Geist fonts, wraps all pages under [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7).
- [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7)
  - Provides next-auth SessionProvider; refetches every 5 minutes and on focus.

Landing page
- [TypeScript.HomePage()](zyke-frontend/components/HomePage.tsx:36)
  - Detects session state to show “Generate Ideas” (authenticated) or “Sign In” (guest).
  - Includes marketing copy, booking dialog posting to a Google Form (no-CORS), FAQs with animation, and legal dialogs.

Idea Generator (core)
- [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326)
  - Internal navbar [TypeScript.LegendaryNavbar()](zyke-frontend/components/IdeaGenerator.tsx:145) with avatar dropdown (profile, credits, logout).
  - Trend fetching and merging logic: [TypeScript.fetchTrendsAndIdeas()](zyke-frontend/components/IdeaGenerator.tsx:359)
  - Repurpose (URL) and manual topic logic: [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484)
  - Navigation to ideas: URL-encodes JSON { name, ideas } into “data” parameter.

Generated Ideas (selection and generation)
- [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52)
  - Decodes nested ideas array; supports switching between individual idea cards and a “Custom Idea” editor state (index -1).
  - Validates selections and platform; [TypeScript.handleGenerateContent()](zyke-frontend/components/GeneratedIdeas.tsx:158) POSTs to backend and redirects on success.

Generated Posts (visualization/edit/export)
- [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777)
  - Loads last posts bundle from backend; draws a responsive grid based on number of images.
  - Exposes caption copy and ZIP export via [TypeScript.handleExportPost()](zyke-frontend/components/GeneratedPosts.tsx:1031).
  - Launches [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61) on image click, where segmentation → blending → inpainting flow occurs.

Brand Voice creation
- [TypeScript.BrandVoiceCreator()](zyke-frontend/components/BrandVoice.tsx:164)
  - Zod schemas: [TypeScript.socialMediaSchema()](zyke-frontend/components/BrandVoice.tsx:40) and [TypeScript.formSchema()](zyke-frontend/components/BrandVoice.tsx:66).
  - Multi-step wizard: validates step-specific fields ([TypeScript.getFieldsByStep()](zyke-frontend/components/BrandVoice.tsx:319)) before proceeding.
  - On submit [TypeScript.onSubmit()](zyke-frontend/components/BrandVoice.tsx:341):
    - Safely folds “other” arrays into main fields
    - Builds multipart FormData (JSON stringifies arrays/objects; appends files)
    - POST /brand_voice_info/create with bearer token, then redirect to /idea-generator.

Brand Profile viewer
- [TypeScript.BrandProfile()](zyke-frontend/components/BrandProfile.tsx:82)
  - Loads and renders the saved brand profile from GET /brand_voice_info/profile.
  - Collapses/expands sections with motion transitions and displays sanitized fields:
    - Brand tone, industries, personalities, content types, target audience, social links, other URLs, etc.
  - Maps numeric brand type to human-readable label via [TypeScript.getBrandTypeDescription()](zyke-frontend/components/BrandProfile.tsx:188).

Payments and credits
- [TypeScript.Component()](zyke-frontend/components/payment/Credits.tsx:53)
  - Fetch helpers: [TypeScript.fetchUserData()](zyke-frontend/components/payment/Credits.tsx:82), [TypeScript.fetchUserCredits()](zyke-frontend/components/payment/Credits.tsx:111), [TypeScript.fetchTransactions()](zyke-frontend/components/payment/Credits.tsx:145), [TypeScript.fetchAdminTransactions()](zyke-frontend/components/payment/Credits.tsx:177).
  - Purchase flow with [TypeScript.handleAddCredits()](zyke-frontend/components/payment/Credits.tsx:210) and Razorpay SDK integration [TypeScript.initializeRazorpay()](zyke-frontend/components/payment/Credits.tsx:374), [TypeScript.makePayment()](zyke-frontend/components/payment/Credits.tsx:241).

Navbar (shared)
- Standalone navbar component: [TypeScript.LegendaryNavbar()](zyke-frontend/components/LegendaryNavbar.tsx:67) used in some pages (the generator file also contains an inline variant with similar behavior).


## Hooks and utilities

Toasts system
- Store and reducer: [TypeScript.reducer()](zyke-frontend/hooks/use-toast.ts:77) with discrete actions ADD_TOAST, UPDATE_TOAST, DISMISS_TOAST, REMOVE_TOAST.
- Imperative API: [TypeScript.toast()](zyke-frontend/hooks/use-toast.ts:145) to emit, update, and dismiss toasts with an ID.
- Hook facade: [TypeScript.useToast()](zyke-frontend/hooks/use-toast.ts:174) exposes state and helpers for use in components.
- Limits and remove delay constants at lines 11–12 ensure visible queue size and lifecycle.

Class name merge
- [TypeScript.cn()](zyke-frontend/lib/utils.ts:4) merges Tailwind classnames using tailwind-merge + clsx.

Trend/fetch utilities
- [zyke-frontend/utils/api.ts](zyke-frontend/utils/api.ts) contains helpers for an external trends API (NEXT_PUBLIC_API_URL); the main generator flows are integrated directly against the Flask backend.


## API contracts and payloads

All authenticated requests must include:
- Authorization: Bearer <accessToken> (available at useSession().data?.accessToken and in next-auth session callback)

Auth
- POST /auth/login { email, password } → { access_token, refresh_token, user: { id, first_name, last_name, email } }
- POST /auth/oauth/callback { email, first_name, last_name, provider_id } → same token-bearing payload
- POST /auth/refresh { refresh_token } → { access_token }

Brand voice
- GET /brand_voice_info/profile → BrandProfile DTO
- POST /brand_voice_info/create (multipart/form-data)
  - files: (optional) multiple file entries
  - JSON fields (stringified arrays/objects): industries, contentTypes, targetAudience, brandPersonalities, otherUrls, socialMedia
  - Scalars: company, location, brandVoiceName, brandTone, brandType, website, manualInputText, designText

Trends and ideas
- GET /trends/fetch_trends → nested list of trends (forwarded to generate_ideas)
- POST /trend_to_idea/generate_ideas
  - { use: "trend", text: string[][] }
  - { use: "topic", text: { topic, summary, description } }
  - { use: "manual", text: { name, description } }
  - Response: { cached?: boolean, ideas: string[][] | object mapping } (UI transforms into { name, ideas } list)

Repurpose
- POST /repurpose/repurpose_url { url, content_type } where content_type ∈ { blog, post, reel, news-article, yt-video, website }
- Response: { topic, summary, description }

Posts
- POST /idea_to_post/fetch_posts { ideas: [ [title, content], ... ], num: number, platform: "instagram" | "linkedin" } → { saved: true }
- POST /fetch_last_post/get_stored_post {} → { posts: { [ideaName: string]: Post[] } } where Post = { caption: string, images: string[] }

Image blend and inpaint
- POST https://click-segment-new-617792710458.asia-southeast1.run.app/segment { x, y, user_id, image: base64 }
- POST /blend/blend_masks { masks: string[], img: base64 } → { blended_images: string[], dilated_masks: string[] }
- POST /inpaint/inpaint_image { prompt: string, neg_prompt: string, remove: "true"|"false", mask: string, image: base64 } → { result: base64|string }

Transactions
- GET /transactions/user → basic user profile ({ email, first_name, last_name, contact, is_admin })
- GET /transactions/credits → { credits: number }
- GET /transactions/history → { transactions: Transaction[] }
- GET /transactions/history/:userId → admin version
- POST /transactions/add { amount: number, currency: "USD" | "INR" } → { order_id, currency, amount }


## Configuration and environment

Environment variables (zyke-frontend/.env.local)
- NEXT_PUBLIC_BACKEND_URL: Flask backend base URL consumed across flows
- NEXT_PUBLIC_API_URL: Optional public trends API (used by [zyke-frontend/utils/api.ts](zyke-frontend/utils/api.ts))
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: OAuth credentials (used by [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14))
- JWT_SECRET_KEY: next-auth secret (used by [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:151))
- NEXT_PUBLIC_RAZORPAY_KEY: Razorpay publishable key (used by [TypeScript.Component()](zyke-frontend/components/payment/Credits.tsx:283))

Next.js config
- [zyke-frontend/next.config.mjs](zyke-frontend/next.config.mjs)
  - reactStrictMode: false (animations and some client behaviors are simpler without strict effects)
  - typescript.ignoreBuildErrors: true (guards CI but may defer type fixes)

TypeScript config
- [zyke-frontend/tsconfig.json](zyke-frontend/tsconfig.json)
  - strict: true for safer typing
  - paths: "@/*" → project root for cleaner imports
  - "moduleResolution": "bundler" for Next 14 compatibility

Tailwind and UI
- [zyke-frontend/tailwind.config.ts](zyke-frontend/tailwind.config.ts) integrates shadcn tokens with hsl(var(--...)) semantic colors and radius tokens.
- [zyke-frontend/app/globals.css](zyke-frontend/app/globals.css) Tailwind base styles.
- shadcn/ui components under [zyke-frontend/components/ui](zyke-frontend/components/ui).

Linting
- [zyke-frontend/.eslintrc.json](zyke-frontend/.eslintrc.json) loosens some strict TS and React rules for velocity.


## Error handling and operational notes

Auth errors
- Credentials failures bubble meaningful messages from backend in [TypeScript.authorize()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:32).
- Google errors handled in [TypeScript.signIn()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:68) with console diagnostics and thrown Error.

ProtectedRoute
- Network error when fetching brand voice defaults to “no profile” and redirects to /user-type.
- Spinner used while loading to avoid flicker.

Idea generation
- 401 on any call prompts “please sign in again”.
- 422 from generate_ideas suggests malformed trends shape; UI logs unexpected structures and surfaces user-friendly failure.

Editor modal safety
- Disables generate unless a valid dilated mask is selected.
- Keeps reversible history so user can revert to previous state at any time.

Payments
- SDK load failure handled with alert in [TypeScript.initializeRazorpay()](zyke-frontend/components/payment/Credits.tsx:374).
- Order creation HTTP errors are caught and alerted.

Performance
- Most pages stream minimal data, deferring heavy work to backend.
- Animations are GPU-friendly (opacity/transform) where possible.


## Extension guide

Add a new content source (Idea Generator)
- Extend the “contentTypes” config and mapping in [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:119) and [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484).
- Implement backend support for /repurpose/repurpose_url and /trend_to_idea/generate_ideas for the new type.

Support new publishing platforms
- Update selector in [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:509) and ensure backend handles platform-specific copy/image guidelines.

Add an auth provider
- Append provider in [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14), add callback logic to fetch tokens from backend, and verify session exposure in [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128).

Introduce a new guarded page
- Wrap page with [TypeScript.ProtectedRoute()](zyke-frontend/components/ProtectedRoute.tsx:14) and set requireBrandVoice depending on the need.

Customize editor pipeline
- Mirror selection → segmentation → blending → inpainting pattern in [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61).
- Integrate alternate segmentation service by swapping out the first POST target, preserving response shape mapping to masks.


## Route matrix

Public
- [zyke-frontend/app/page.tsx](zyke-frontend/app/page.tsx) → Landing ([TypeScript.HomePage()](zyke-frontend/components/HomePage.tsx:36))
- [zyke-frontend/app/signin/page.tsx](zyke-frontend/app/signin/page.tsx) → Auth ([TypeScript.SignIn()](zyke-frontend/components/authentication/Signin.tsx:22))
- [zyke-frontend/app/signup/page.tsx](zyke-frontend/app/signup/page.tsx) → Auth (component at [zyke-frontend/components/authentication/Signup.tsx](zyke-frontend/components/authentication/Signup.tsx))
- [zyke-frontend/app/verify-otp/page.tsx](zyke-frontend/app/verify-otp/page.tsx) → OTP (component at [zyke-frontend/components/authentication/Verify-Otp.tsx](zyke-frontend/components/authentication/Verify-Otp.tsx))
- [zyke-frontend/app/reset-password/page.tsx](zyke-frontend/app/reset-password/page.tsx) → Reset (component at [zyke-frontend/components/authentication/ResetPassword.tsx](zyke-frontend/components/authentication/ResetPassword.tsx))

Authenticated, no brand voice required
- [zyke-frontend/app/brandvoice/page.tsx](zyke-frontend/app/brandvoice/page.tsx) → [TypeScript.BrandVoiceCreator()](zyke-frontend/components/BrandVoice.tsx:164)

Authenticated, brand voice required
- [zyke-frontend/app/idea-generator/page.tsx](zyke-frontend/app/idea-generator/page.tsx) → [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326)
- [zyke-frontend/app/generated-ideas/page.tsx](zyke-frontend/app/generated-ideas/page.tsx) → [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52)
- [zyke-frontend/app/generated-posts/page.tsx](zyke-frontend/app/generated-posts/page.tsx) → [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777)
- [zyke-frontend/app/brandprofile/page.tsx](zyke-frontend/app/brandprofile/page.tsx) → [TypeScript.BrandProfile()](zyke-frontend/components/BrandProfile.tsx:82)
- [zyke-frontend/app/credits/page.tsx](zyke-frontend/app/credits/page.tsx) → Credits (renders [TypeScript.Component()](zyke-frontend/components/payment/Credits.tsx:53))

API Routes
- [zyke-frontend/app/api/auth/[...nextauth]/route.ts](zyke-frontend/app/api/auth/[...nextauth]/route.ts) → [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14), [TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101), [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128), [TypeScript.redirect()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:136)


## Appendix: Types and interfaces

Idea Generator
- Trend: name, summary, description, ideas?: string[][], relevanceScore?: number (built in [TypeScript.fetchTrendsAndIdeas()](zyke-frontend/components/IdeaGenerator.tsx:359))
- RepurposeResponse: [TypeScript.RepurposeResponse()](zyke-frontend/components/IdeaGenerator.tsx:80) → { description, summary, topic }
- RepurposeIdeaResponse: [TypeScript.RepurposeIdeaResponse()](zyke-frontend/components/IdeaGenerator.tsx:86) → { cached: boolean, ideas: string[][] }

Generated Ideas
- Idea model: [TypeScript.Idea()](zyke-frontend/components/GeneratedIdeas.tsx:38) → { id:number, title:string, content:string, type:string }
- IncomingIdea tuple: [TypeScript.IncomingIdea()](zyke-frontend/components/GeneratedIdeas.tsx:45) → [title, content]
- API response: [TypeScript.ApiResponse()](zyke-frontend/components/GeneratedIdeas.tsx:48) → { saved: "True" | "False" } (UI normalizes to boolean)

Generated Posts
- Post: [TypeScript.Post()](zyke-frontend/components/GeneratedPosts.tsx:39) → { caption:string, images:string[] }
- Idea: [TypeScript.Idea()](zyke-frontend/components/GeneratedPosts.tsx:44) → { id:string, title:string, type:string, posts: Post[] }
- ImageModal props: [TypeScript.ImageModalProps()](zyke-frontend/components/GeneratedPosts.tsx:52)

Brand Voice/Profile
- Zod schemas validate a comprehensive payload; arrays are merged with “other” fields on submit in [TypeScript.onSubmit()](zyke-frontend/components/BrandVoice.tsx:341).
- BrandProfile viewer expects fields documented in [TypeScript.BrandProfile()](zyke-frontend/components/BrandProfile.tsx:64–80).

Payments
- [TypeScript.Transaction()](zyke-frontend/components/payment/Credits.tsx:33)
- [TypeScript.UserData()](zyke-frontend/components/payment/Credits.tsx:45)

Analytics
- Pages Router wrapper adds GA: [TypeScript.MyApp()](zyke-frontend/pages/_app.tsx:4)


## Advanced Deep Dive

This section supplements the primary documentation with exhaustive internals, exact execution sequences, edge cases, and operational guidance. It is additive and does not alter the existing structure.

### 1) System Architecture Deep Dive

Execution model
- Next.js 14 App Router with React Server Components (RSC) and Client Components boundary.
- Public pages (landing, auth) render largely CSR with minimal SSR constraints for faster interactivity.
- Auth-sensitive routes use client-side guards via [TypeScript.ProtectedRoute()](zyke-frontend/components/ProtectedRoute.tsx:14), deferring authorization checks to client after session hydration to avoid server-side token leakage.
- Global provider: [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7) mounts a SessionProvider with frequent refresh to keep tokens warm.

Resource loading
- Fonts are preloaded and embedded via [TypeScript.RootLayout()](zyke-frontend/app/layout.tsx:22) to stabilize CLS.
- UI primitives via shadcn/ui and Tailwind are tree-shakable; only used components included.

Data flow boundaries
- All backend calls are from client components using the bearer access token surfaced via [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128).
- Authentication tokens are minted and refreshed in [TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101) and never written to localStorage; they remain in the next-auth session store.

ASCII overview

  +------------------------+       +---------------------+
  | Next.js App (Frontend) |       | Flask Backend (API) |
  +----------+-------------+       +----------+----------+
             | Bearer access_token          |
             | (from next-auth session)     |
             v                               v
  [UI Components & Flows] -----> [Auth, Brand Voice, Trends, Posts, Images, Transactions]
             ^                               ^
             |<--- next-auth session --------|
             |
  [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7) session hydration & refresh

RSC vs Client components
- Landing and marketing content can be RSC-friendly, but interactive flows (Idea Generator, Image Modal, Payments) are Client Components due to browser APIs, SDKs, and imperative handlers.

Concurrency, idempotency, and retries
- UI orchestrates single-flight actions per user interaction (e.g., disable buttons during pending states) to prevent duplicate submissions (payments, idea generation).
- Backend should be the source of idempotency truth (e.g., order_id) for financial operations; frontend guards are best-effort.


### 2) Authentication Lifecycle — Exhaustive

Providers and sign-in
- Credentials: [TypeScript.authorize()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:32) POST /auth/login { email, password } → tokens, user.
- Google OAuth: [TypeScript.signIn()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:68) receives provider profile, POST /auth/oauth/callback { provider_id + user info } → tokens, user.

JWT callback
- [TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101):
  - First run after sign-in attaches accessToken, refreshToken, user.id, and (optionally) accessTokenExpiresAt if returned.
  - Subsequent runs check expiry; if expired, POST /auth/refresh { refresh_token } to rotate accessToken.
  - On refresh failure: tokens are dropped; downstream [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) exposes no accessToken → user is deauthed on client.

Session callback
- [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) maps { accessToken, refreshToken, user.id } onto session.user and top-level session fields so components can reliably read Authorization state.

Redirect
- [TypeScript.redirect()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:136) redirects post-login to /idea-generator.

ASCII sequence (Credentials sign-in)

User
  |
  | submit { email, password }
  v
[TypeScript.authorize()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:32) --POST /auth/login--> Backend
  |<-- { access_token, refresh_token, user } --
  |
  v
[TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101) attaches tokens
  |
  v
[TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) exposes tokens
  |
  v
[TypeScript.redirect()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:136) → /idea-generator

ASCII sequence (Silent refresh)

Timer/Focus
  |
  v
[TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7) triggers refresh → [TypeScript.jwt()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:101)
  | if expired
  |-- POST /auth/refresh { refresh_token } -->
  |<-- { access_token } --
  | update token in JWT
  v
[TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) exposes new access_token

Failure modes
- Refresh 401/403 → drop tokens; ProtectedRoute will redirect to /signin.
- Backend shape changes → guard parsing in callbacks and fail closed with explicit console error for developers.
- Clock skew: prefer accessTokenExpiresAt from backend; otherwise backoff window of ~30s pre-expiry to avoid mid-call expiry.

Security posture
- No secrets in localStorage; next-auth secure cookies/session are used.
- Only access token is sent to backend per request over HTTPS.
- Google provider scopes are minimal; only identity basics are used for bootstrap.


### 3) Route Protection & Brand Voice Gating — Algorithm

Guard pseudocode

function ProtectedRoute(requireBrandVoice: boolean) {
  // 1. Read session
  const session = useSession();

  // 2. Not authenticated → redirect
  if (!session || !session.accessToken) redirect('/signin');

  // 3. If brand voice required, check profile
  if (requireBrandVoice) {
    const res = GET /brand_voice_info/profile (Authorization: Bearer session.accessToken)
    if (res.status === 200 && res.data?.brandVoiceExists) {
      render children
    } else {
      redirect('/user-type'); // onboarding to create brand voice
    }
  } else {
    render children
  }
}

Notes and edges
- Network error on brand voice fetch → treat as no profile (fail closed) and redirect to /user-type; avoids leaking route content.
- Spinner: [TypeScript.LoaderSpinner()](zyke-frontend/components/LoaderSpinner.tsx:1) used during auth/profile checks.
- Prevents flash of protected content by gating rendering until checks resolve.


### 4) Feature Flows — End-to-End Internals

Idea generation — Trends
- [TypeScript.fetchTrendsAndIdeas()](zyke-frontend/components/IdeaGenerator.tsx:359)
  - GET /trends/fetch_trends with bearer.
  - POST /trend_to_idea/generate_ideas { use: "trend", text: trendsData.trends }.
  - Normalize ideas to { name, ideas: string[][] } and score via client heuristics (e.g., relevance).
  - Errors: 401 → sign-in prompt; 422 → malformed trend structure; surface a friendly toast via [TypeScript.toast()](zyke-frontend/hooks/use-toast.ts:145).

Idea generation — Repurpose URL
- [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484)
  - Map content_type; POST /repurpose/repurpose_url { url, content_type }.
  - Lifted { topic, summary, description } into generate_ideas as { use: "topic", text: {...} }.

Idea generation — Custom Topic
- Same handler path with { use: "manual", text: { name, description } }.

Navigation to ideas
- Serialize dataToSend as JSON → encodeURIComponent → push to /generated-ideas?data=...

Generated Ideas → Posts
- [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52) maintains:
  - Selected idea IDs (or -1 for Custom Idea), post count (1..5), includeAI flag, platform.
  - [TypeScript.handleGenerateContent()](zyke-frontend/components/GeneratedIdeas.tsx:158) validates selections and POSTs to /idea_to_post/fetch_posts.
  - Expect { saved: true } response → navigate /generated-posts.

Generated Posts visualization & editor
- [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777) POST /fetch_last_post/get_stored_post → { posts by idea }.
- Image Modal: [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61)
  - Selection: [TypeScript.activateSelectMask()](zyke-frontend/components/GeneratedPosts.tsx:281) toggles point-pick mode; [TypeScript.handleImageClick()](zyke-frontend/components/GeneratedPosts.tsx:117) sends proportional coords to click-seg service.
  - Blend: /blend/blend_masks returns blended_images and dilated_masks; [TypeScript.handleMaskSelection()](zyke-frontend/components/GeneratedPosts.tsx:257).
  - Inpaint: [TypeScript.handleGenerate()](zyke-frontend/components/GeneratedPosts.tsx:386) with { prompt, neg_prompt, remove, mask, image } → append to image history.
  - Export: [TypeScript.handleExportPost()](zyke-frontend/components/GeneratedPosts.tsx:1031) zips images + caption.

User feedback
- Use [TypeScript.toast()](zyke-frontend/hooks/use-toast.ts:145) categories:
  - success: generation complete, download ready
  - warning: partial failures (e.g., some masks failed)
  - error: backend errors, auth expiry
  - info: long-running request started


### 5) Image Editing Pipeline — Data and Math

Data model
- Original image: base64 string (data URL or raw base64), stored in modal state.
- Mask selection: point (x, y) given in element pixel coords normalized to [0,1]:
  - normalizedX = clickX / imageElementWidth
  - normalizedY = clickY / imageElementHeight
- Segmentation request: { x: normalizedX, y: normalizedY, user_id, image: base64 } → list of binary masks (encoded, base64).
- Blending: /blend/blend_masks { masks, img } → returns:
  - blended_images: images with masked areas blended/composited
  - dilated_masks: erosion/dilation-adjusted masks for smoother inpainting edges
- Inpainting: /inpaint/inpaint_image { prompt, neg_prompt, remove, mask, image } → new image base64 (or URL)

History & undo
- Modal keeps an array of versions: [original, blendedX, inpaintY, ...].
- [TypeScript.handleRevert()](zyke-frontend/components/GeneratedPosts.tsx:295) pops or selects a prior index to revert nondestructively.

Edge cases
- Large images → consider temporary downscale before segmentation to reduce latency; backend can upscale on inpainting step.
- Mask empty or invalid → disable generate button, guard with user message.
- Base64 memory pressure → allow URLs in export flow; [TypeScript.handleExportPost()](zyke-frontend/components/GeneratedPosts.tsx:1031) already handles both URL and base64.

Performance hints
- Defer decoding images until modal open.
- Revoke object URLs when no longer needed.
- Keep only last N history entries to cap memory (e.g., N=10).


### 6) Payments & Credits — Full Flow

Preconditions
- Access token required; user profile from GET /transactions/user used to determine is_admin.

Order creation
- [TypeScript.handleAddCredits()](zyke-frontend/components/payment/Credits.tsx:210)
  - POST /transactions/add { amount, currency } returns { order_id, currency, amount }.
  - Validate amount on client (e.g., minimum threshold) before proceeding.

Razorpay SDK
- [TypeScript.initializeRazorpay()](zyke-frontend/components/payment/Credits.tsx:374) injects https://checkout.razorpay.com/v1/checkout.js and resolves when window.Razorpay is available.
- [TypeScript.makePayment()](zyke-frontend/components/payment/Credits.tsx:241) opens checkout with:
  - key: NEXT_PUBLIC_RAZORPAY_KEY
  - order_id: backend order
  - handler: on success, notify backend (if required by backend design) and refresh credits

Idempotency & reconciliation
- The definitive crediting source is the backend; UI should refetch credits after handler to avoid stale balance.
- If network loss occurs after successful payment, user can refresh; credits endpoint should reflect final state.

Admin views
- [TypeScript.fetchAdminTransactions()](zyke-frontend/components/payment/Credits.tsx:177) loads history for any user when is_admin true.


### 7) Component Catalog — Props, State, Effects, Events

Root shell
- [TypeScript.RootLayout()](zyke-frontend/app/layout.tsx:22)
  - Props: children
  - State: none
  - Effects: none
  - Concerns: font loading, metadata, session provider inclusion

Session provider
- [TypeScript.ClientProvider()](zyke-frontend/components/ClientProvider.tsx:7)
  - Props: children
  - State: none
  - Effects: session refetch on window focus and 5m interval
  - Notes: ensures [TypeScript.session()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:128) stays fresh

Idea generator
- [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326)
  - State: selected tab (trend/repurpose/custom), inputs, loading flags, combined trends
  - Events: submit handlers to fetch trends/repurpose/manual
  - Effects: may prefetch trends on mount depending on UX
  - Perf: memoize large lists; guard re-renders when typing

Generated ideas
- [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52)
  - State: selected ideas set, post count, platform, includeAI
  - Events: [TypeScript.handleGenerateContent()](zyke-frontend/components/GeneratedIdeas.tsx:158)
  - Perf: virtualization possible for large idea lists

Generated posts & editor
- [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777)
  - State: posts map, modal state, image history
  - Events: [TypeScript.handleExportPost()](zyke-frontend/components/GeneratedPosts.tsx:1031), modal open/close, mask selection
  - Perf: lazy load images; release unused history images

Brand voice creator
- [TypeScript.BrandVoiceCreator()](zyke-frontend/components/BrandVoice.tsx:164)
  - State: form state by step, validation errors
  - Events: [TypeScript.onSubmit()](zyke-frontend/components/BrandVoice.tsx:341)
  - Notes: careful FormData creation; stringify arrays/objects

Navbar
- [TypeScript.LegendaryNavbar()](zyke-frontend/components/LegendaryNavbar.tsx:67)
  - State: menu open/closed, motion states
  - Events: sign out, route navigation


### 8) API Contracts — Schemas, Status Codes, Examples

Headers
- Authorization: Bearer &lt;accessToken&gt;
- Content-Type: application/json unless multipart/form-data

Auth
- POST /auth/login
  - Body: { email: string, password: string }
  - 200: { access_token: string, refresh_token: string, user: { id: string, first_name: string, last_name: string, email: string } }
  - 401: { error: "invalid_credentials" }
- POST /auth/oauth/callback
  - Body: { email, first_name, last_name, provider_id }
  - 200: same as /auth/login
- POST /auth/refresh
  - Body: { refresh_token: string }
  - 200: { access_token: string }
  - 401: { error: "invalid_refresh" }

Brand Voice
- GET /brand_voice_info/profile
  - 200: { brandVoiceExists: boolean, ...profileFields }
  - 404: { brandVoiceExists: false }
- POST /brand_voice_info/create (multipart/form-data)
  - Files: 0..n files
  - JSON string fields: industries, contentTypes, targetAudience, brandPersonalities, otherUrls, socialMedia
  - Scalars: company, location, brandVoiceName, brandTone, brandType, website, manualInputText, designText
  - 201: { created: true }

Trends & Ideas
- GET /trends/fetch_trends
  - 200: string[][] (nested list)
- POST /trend_to_idea/generate_ideas
  - Body union:
    - { use: "trend", text: string[][] }
    - { use: "topic", text: { topic: string, summary: string, description: string } }
    - { use: "manual", text: { name: string, description: string } }
  - 200: { cached?: boolean, ideas: string[][] | object }

Repurpose
- POST /repurpose/repurpose_url
  - Body: { url: string, content_type: "blog" | "post" | "reel" | "news-article" | "yt-video" | "website" }
  - 200: { topic: string, summary: string, description: string }

Posts
- POST /idea_to_post/fetch_posts
  - Body: { ideas: [ [title: string, content: string], ... ], num: number, platform: "instagram" | "linkedin" }
  - 200: { saved: true }
- POST /fetch_last_post/get_stored_post
  - Body: {}
  - 200: { posts: { [ideaName: string]: { caption: string, images: string[] }[] } }

Image Editing
- POST click-seg /segment
  - Body: { x: number (0..1), y: number (0..1), user_id: string, image: base64 }
  - 200: { masks: string[] }
- POST /blend/blend_masks
  - Body: { masks: string[], img: base64 }
  - 200: { blended_images: string[], dilated_masks: string[] }
- POST /inpaint/inpaint_image
  - Body: { prompt: string, neg_prompt: string, remove: "true"|"false", mask: string, image: base64 }
  - 200: { result: string }

Transactions
- GET /transactions/user → 200 { email, first_name, last_name, contact, is_admin }
- GET /transactions/credits → 200 { credits: number }
- GET /transactions/history → 200 { transactions: Transaction[] }
- GET /transactions/history/:userId → 200 { transactions: Transaction[] }
- POST /transactions/add
  - Body: { amount: number, currency: "USD" | "INR" }
  - 200: { order_id: string, currency: string, amount: number }

Error model conventions
- { error: string, message?: string, details?: any }
- Use toast severity mapping for UX.

Rate limiting & timeouts (recommendations)
- UI: 10s request timeout; expose retry for transient failures (5xx, network).
- Backoff: exponential (250ms, 500ms, 1s) capped at 3 tries for non-payment calls.


### 9) Configuration Matrix & Security

Environment variables
- NEXT_PUBLIC_BACKEND_URL: required; HTTPS; no trailing slash recommended.
- NEXT_PUBLIC_API_URL: optional; used by [zyke-frontend/utils/api.ts](zyke-frontend/utils/api.ts).
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: required for Google OAuth in [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14).
- JWT_SECRET_KEY: required; secure random; used by [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:151).
- NEXT_PUBLIC_RAZORPAY_KEY: required for payments in [TypeScript.Component()](zyke-frontend/components/payment/Credits.tsx:283).

Security notes
- Never commit .env.local.
- Restrict CORS and only call trusted HTTPS origins.
- Validate file uploads in brand voice; strip EXIF if backend returns URLs for user-uploaded media.
- Sanitize any HTML returned from backend; current flows operate on plain text and images.

Allowed external hosts
- Backend at NEXT_PUBLIC_BACKEND_URL.
- Razorpay https://checkout.razorpay.com
- Segmentation service: https://click-segment-new-617792710458.asia-southeast1.run.app


### 10) Operational Playbook

Observability
- Console logs are present for exceptional branches in [TypeScript.authOptions()](zyke-frontend/app/api/auth/[...nextauth]/route.ts:14) callbacks.
- Consider adding a client logger abstraction to centralize event capture (auth refresh, API failures, payment outcomes).

Common failure handling
- 401 anywhere → prompt re-auth; let ProtectedRoute redirect.
- 422 on generate_ideas → show “We couldn’t parse trends; try again.”
- Payment failure → show alert and re-enable “Add Credits”.

Resilience patterns
- Disable buttons during pending.
- AbortController to cancel in-flight requests on route change or modal close.
- Debounce text inputs where applicable.


### 11) Testing Strategy (Recommended)

Unit tests
- Pure utilities: [TypeScript.cn()](zyke-frontend/lib/utils.ts:4), trend normalizers in [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:326).
- Reducer: [TypeScript.reducer()](zyke-frontend/hooks/use-toast.ts:77) add/update/dismiss/remove flows.

Integration tests
- Mock fetch for /trend_to_idea/generate_ideas and verify UI transitions in [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52).
- Image modal state machine: ensure mask selection enables inpaint.

E2E tests
- Sign-in (mock backend).
- Trend → Ideas → Posts → Export ZIP happy path.

Tooling
- React Testing Library + Jest for unit/integration.
- Playwright or Cypress for E2E.


### 12) Performance & Accessibility

Performance
- Lazy-load images in [TypeScript.GeneratedPosts()](zyke-frontend/components/GeneratedPosts.tsx:777).
- Memoize heavy components; avoid passing unstable props.
- Image history cap to limit memory.
- Avoid React Strict Mode double effect cost where not required (see [zyke-frontend/next.config.mjs](zyke-frontend/next.config.mjs)).

Accessibility
- Provide alt text for generated images (caption summary).
- Keyboard-accessible modals and focus trapping in [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61).
- Ensure sufficient contrast with Tailwind tokens defined in [zyke-frontend/tailwind.config.ts](zyke-frontend/tailwind.config.ts).


### 13) Extension Guides

New content type (repurpose)
- Update contentTypes in [TypeScript.IdeaGenerator()](zyke-frontend/components/IdeaGenerator.tsx:119).
- Map to backend content_type in [TypeScript.handleGetTopic()](zyke-frontend/components/IdeaGenerator.tsx:484).
- Update backend /repurpose/repurpose_url and /trend_to_idea/generate_ideas.

New publishing platform
- Extend platform selector in [TypeScript.GeneratedIdeas()](zyke-frontend/components/GeneratedIdeas.tsx:52) and ensure backend post generator supports new platform nuances.

New editor operation
- Mirror select → segment → blend → inpaint flow in [TypeScript.ImageModal()](zyke-frontend/components/GeneratedPosts.tsx:61).
- Add a new operation tab; define request payload and plug into history stack consistently.


### 14) Glossary

- Idea: A topic seed with title and supporting content.
- Post: A generated artifact: caption + images array.
- Mask: Binary image used to constrain inpainting region.
- Inpainting: Image synthesis constrained by mask and prompt.
- Brand Voice: Structured profile capturing tone, industries, audience, etc.
— End of document —
