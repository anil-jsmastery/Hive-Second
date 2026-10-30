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
