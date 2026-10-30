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
