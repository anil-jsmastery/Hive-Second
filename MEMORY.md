# Project memory

What exists in this project right now. Each step appends one block at the end.
Never edit earlier blocks.

## After step 00
- Next.js App Router app with Tailwind CSS and shadcn/ui (Radix base, preset bIkeymG). Packages are pinned; install with npm ci only.
- .claude/settings.json pins the coding agent to claude-opus-5-5 at medium effort, ultracode off.
- next.config.ts is fixed (VERBATIM): Cache Components and partial prefetching off, React Compiler on, Tailwind runs through the Turbopack CSS rule (no postcss.config). Pages render dynamically per user.
- Memory: CLAUDE.md imports AGENTS.md, MEMORY.md, build-plan/CONTRACT.md and build-plan/DESIGN.md.
- AGENTS.md: our rules on top (rule 14: no design skills or plugins; the design file decides the look); the Next.js and PostHog blocks below are tool-managed and never edited.
- MCP servers in .mcp.json: clerk, supabase (scoped by SUPABASE_PROJECT_REF), posthog.
- Agent skills in .agents/skills/ (Clerk: Next.js, billing, organizations, custom flows, CLI; Supabase; four PostHog skills). Git-ignored: each person installs them in Step 00.

## After step 01
- PRODUCT.md, TRACKING_PLAN.md and DECISIONS.md exist. The tracking plan is the only source of event names.

## After step 02
- Hive Night design: app/hive-night.css is the design file's <style> block, unchanged; app/hive-night-app.css holds the integration rules. Dark only, Geist and Geist Mono.
- build-plan/design/hive-night.html is the visual source of truth for every page. DESIGN.md wins on looks; the steps win on behaviour.
- Shared: HiveMark, GlowDefs, Honeycomb, SkillGlyph, AvatarInitial, PageShell, EmptyState, NavLink, SiteHeader, SiteFooter, components/night/icons.tsx (the design's icons); lib/hash.ts. Toasts are sonner, bottom-center, class hive-toast.

## After step 03
- Supabase tables: profiles, organizations, skills, stars, comments, follows, notifications, activities. All have RLS.
- RLS reads Clerk's session token: requesting_user_id() = sub, requesting_org_id() = active organization.
- Triggers create activities and notifications and keep skills.stars_count correct. App code never does these.
- search_skills(q, stack_filter) RPC returns up to 30 visible skills, ranked. slug_taken(candidate) checks every slug, including private ones.
- lib/supabase/types.ts is generated (npm run db:types). lib/constants.ts, lib/slug.ts, lib/time.ts exist.

## Plan update: 0005 hardening
- Migration 0005_hardening: session helpers have a fixed search_path; trigger functions aren't callable through the API; slug_taken is callable by signed-in users only. Step 13's migration is 0006.

## After step 04
- seed/skills/ holds the 30 skill files copied from build-plan/seed-skills/.
- npm run db:seed resets all skills, stars, comments, follows, notifications and activities, then loads 8 seed authors (ids start with seed_) and 30 public skills.

## After step 05
- PostHog helpers: lib/analytics/events.ts (the only event list), server.ts (trackServer with optional orgId, setPersonProperties, identifyOrganization, getFlag), client.ts (trackClient).
- instrumentation-client.ts initializes posthog-js with autocapture off and registers swarm properties from the URL.
- TrackOnMount fires a client event once per mount.

## After step 06
- Clerk: ClerkProvider (shadcn theme), proxy.ts with clerkMiddleware, /sign-in and /sign-up pages, username required, development instance.
- Supabase accepts Clerk session tokens (third-party auth). lib/supabase/server.ts createServerSupabase() is the only app client.
- lib/profile.ts getCurrentProfile() creates the profile on first sign-in and sends user_signed_up once.
- AnalyticsIdentity identifies the Clerk user, resets on sign-out and sets the organization group.
- /onboarding saves the stack to profiles and to PostHog person properties.

## After step 07
- Landing page (Hive Night home view): hero with one CTA (landing_cta_clicked) over the Honeycomb, and ActivityFeed: 8 rows from latestActivity() in lib/queries/activity.ts, refreshed every 15 seconds with the design's animations.

## After step 08
- /explore: URL state (q, stack), search form, stack filter pills, SkillCard list from searchSkills() in lib/queries/search.ts (search_skills RPC).
- Events: search_performed (TrackOnMount keyed by query and stack), search_result_opened (SkillCard).
- SkillCard shows author, stack, team badge, Private badge, tags and stars.

## After step 09
- /s/[slug]: getSkill() and hasStarred() in lib/queries/skill.ts (RLS decides visibility).
- app/s/[slug]/actions.ts: installSkill (skill_installed), toggleStar (skill_starred on star only). Star counts come from the trigger.
- Client events: skill_viewed, share_link_opened. Toasts: "Install command copied", "Starred", "Star removed", "Link copied", "Published".

## After step 10
- forkSkill (public skills only, forks are public and personal, skill_forked) and postComment (1–500 chars, comment_posted) in app/s/[slug]/actions.ts.
- Comments section on the skill page. Notifications and activities for forks and comments come from triggers.

## After step 11
- /publish: PublishForm (useActionState) with title, description, stack, tags, Write/Preview content. publish_started on mount.
- PublishForm (Hive Night publish view: form plus live card preview) submits through onSubmit + startTransition(formAction), never the form's action prop.
- Stack, Publish as and Visibility are native controls (select and radios) whose values live in React state, so they submit reliably and survive a failed submit.
- app/publish/actions.ts publishSkill(variant, ...): validates with lib/validation.ts, checks plan features for private skills (returns paywall), publishes as team via ensureOrganization() when owner=team, sends skill_published.
- lib/organization.ts ensureOrganization() upserts the active Clerk organization into Supabase and identifies the PostHog group.

## After step 12
- /u/[handle]: profile header, follower counts, Follow button (toggleFollow, not tracked on purpose), published skills.

## After step 13
- /dashboard (Hive Night dashboard view): four stats from dashboard_stats() (migration 0006, counts only) with sparklines; skills panel with tabs (Your skills, Forks) from skillRows(); Activity panel (openNotification marks read, sends notification_clicked, redirects; markAllNotificationsRead sends no event).
- Header shows unreadCount() from lib/queries/notifications.ts after the Dashboard link.

## After step 14
- Clerk organizations are Hive teams. OrganizationSwitcher in the header (personal accounts allowed, slugs on).
- /o/[slug] team page (skill-view header pattern). Publish as personal or team (native owner select). Dashboard panel gets a "Team: {name}" tab when a team is active.
- Team actions carry the PostHog organization group (client group + server orgId + identifyOrganization).

## After step 15
- Deployed on Vercel with the Clerk development instance. PostHog: replays, heatmaps and exception autocapture on, autocapture off, a test-account filter for cohort starting with swarm.

## After step 16
- Clerk Billing: Pro (user, private_skills, $8) and Team (organization, team_private_skills, $20) on the development gateway.
- /pricing with For you / For teams tabs (pricing_viewed). Header has a Pricing link.
- Publish form: Visibility field and PaywallDialog (paywall_shown). publishSkill gates private skills with has({ feature }).
- Upgrading from the paywall: "See plans" saves the draft to sessionStorage (hive:publish-draft) and opens /pricing?from=publish; only then does PricingTable redirect to /publish?upgraded=1, where the draft is restored. Direct visits to /pricing stay there after paying.
- app/api/webhooks/clerk/route.ts verifies Clerk webhooks: organization.created (upsert + organization_created), subscriptionItem.active/canceled (subscription_started/canceled, free plans ignored).

## After step 17
- swarm/ harness copied unchanged from build-plan/swarm/: Playwright agents with personas, Clerk testing tokens and +clerk_test accounts, test card for payments (iframes included), spread arrivals, saved sessions for the return wave, evidence-based success, structured output and retries. Browsers present as normal Chrome (so posthog-js doesn't drop them as bots) and have clipboard permission.
- node swarm/cleanup.mjs --yes removes swarm test users, their teams and their data before each run.
- Model: SWARM_MODEL in swarm/.env, any provider (openai, anthropic, gemini, deepseek, moonshot, openrouter, or compat for any OpenAI-compatible API); keys as SWARM_* in swarm/.env (git-ignored, never in the coding agent's shell). The chosen model is recorded in DECISIONS.md.
