'use client';
import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { publishSkill, type PublishField, type PublishState } from '@/app/publish/actions';
import { Markdown } from '@/components/skill/markdown';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { LockIcon, StarIcon } from '@/components/night/icons';
import { DRAFT_KEY, PaywallDialog } from '@/components/billing/paywall-dialog';
import type { Variant } from '@/lib/analytics/events';
import { STACKS } from '@/lib/constants';
import { slugify } from '@/lib/slug';

const TAGS_HINT = 'Comma-separated, up to 5. Example: auth, nextjs';

function template(title: string, description: string) {
  return `# ${title || 'Skill name'}

${description || 'One sentence on what the skill does.'}

## When to use

Describe the situations where an agent should reach for this skill.

## Steps

1. The first thing the agent should do.
2. The next step.

## Output

What the agent should hand back when it's done.`;
}

// The publish view: the form on the left, a live Explore card preview on the right.
// Submits through onSubmit so React never resets the fields after a failed submit.
export function PublishForm({ variant, teamName }: { variant: Variant; teamName: string | null }) {
  const [state, formAction] = useActionState<PublishState, FormData>(publishSkill.bind(null, variant), {});
  const [pending, startTransition] = useTransition();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgraded') === '1';
  const restored = useRef(false);

  const [title, setTitle] = useState(state.values?.title ?? '');
  const [description, setDescription] = useState(state.values?.description ?? '');
  const [stack, setStack] = useState(state.values?.stack ?? '');
  const [owner, setOwner] = useState(state.values?.owner || 'personal');
  const [tags, setTags] = useState(state.values?.tags ?? '');
  const [content, setContent] = useState(state.values?.content ?? '');
  const [visibility, setVisibility] = useState(state.values?.visibility || 'public');
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  // The paywall opens for every submit that returns one, until it's closed.
  const [closedFor, setClosedFor] = useState<PublishState | null>(null);
  const paywall = state.paywall && closedFor !== state ? state.paywall : null;

  // Back from checkout: restore the draft "See plans" saved. Never publishes on its own.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(DRAFT_KEY);
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    if (!upgraded) return;
    if (raw) {
      const draft = JSON.parse(raw) as Record<string, string>;
      setTitle(draft.title ?? '');
      setDescription(draft.description ?? '');
      setStack(draft.stack ?? '');
      setOwner(draft.owner || 'personal');
      setTags(draft.tags ?? '');
      setContent(draft.content ?? '');
      setVisibility('private');
      toast('Your plan is active. Your draft is back, ready to publish.');
    }
    const params = new URLSearchParams(window.location.search);
    params.delete('upgraded');
    const rest = params.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [upgraded, pathname, router]);

  const slug = slugify(title.trim()) || 'your-skill';
  const rawTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
  const previewTags = rawTags.map((t) => t.toLowerCase()).slice(0, 5);
  const err = (field: PublishField) => state.errors?.[field];
  const fld = (field: PublishField) => (err(field) ? 'fld err' : 'fld');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <>
      <form className="pform" noValidate onSubmit={onSubmit}>
        {state.formError ? <div className="form-alert" role="alert">{state.formError}</div> : null}

        <div className={fld('title')}>
          <label htmlFor="p-title">Title</label>
          <input className="inp" id="p-title" name="title" autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} />
          <p className="hint">Your skill will live at <code>/s/{slug}</code></p>
          <p className="err-msg">{err('title')}</p>
        </div>

        {teamName ? (
          <div className="fld">
            <label htmlFor="p-owner">Publish as</label>
            <select className="inp" id="p-owner" name="owner" value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option value="personal">Personal (@{user?.username ?? ''})</option>
              <option value="team">{teamName}</option>
            </select>
            <p className="hint">Team skills show your team’s name and live on its team page.</p>
          </div>
        ) : null}

        <div className={fld('description')}>
          <label htmlFor="p-desc">Description</label>
          <input className="inp" id="p-desc" name="description" autoComplete="off" value={description} onChange={(e) => setDescription(e.target.value)} />
          <p className="hint">One sentence on what the skill does.</p>
          <p className="err-msg">{err('description')}</p>
        </div>

        <div className={fld('stack')}>
          <label htmlFor="p-stack">Stack</label>
          <select className="inp" id="p-stack" name="stack" value={stack} onChange={(e) => setStack(e.target.value)}>
            <option value="">Choose a stack</option>
            {STACKS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="err-msg">{err('stack')}</p>
        </div>

        <div className={fld('tags')}>
          <label htmlFor="p-tags">Tags</label>
          <input className="inp" id="p-tags" name="tags" autoComplete="off" value={tags} onChange={(e) => setTags(e.target.value)} />
          {rawTags.length > 5
            ? <p className="hint warn">Only the first 5 tags will be saved. You have {rawTags.length}.</p>
            : <p className="hint">{TAGS_HINT}</p>}
          <p className="err-msg">{err('tags')}</p>
        </div>

        <fieldset className="fld">
          <legend className="lbl">Visibility</legend>
          <div className="vis">
            <label className="vis-opt">
              <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} />
              <span className="radio" />
              <span>
                <span className="vis-title">Public</span>
                <span className="vis-sub">Anyone can find and install it.</span>
              </span>
            </label>
            <label className="vis-opt">
              <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
              <span className="radio" />
              <span>
                <span className="vis-title"><LockIcon />Private <span className="pro">{owner === 'team' ? 'Team' : 'Pro'}</span></span>
                <span className="vis-sub">
                  {owner === 'team' ? 'Only your team can see it. Needs Team.' : 'Only you can see it. Needs Pro.'}
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className={fld('content')}>
          <span className="lbl" id="content-lbl">Skill content</span>
          <div className="editor">
            <div className="editor-bar">
              <span className="editor-file">{slug}.md</span>
              <div className="editor-tools">
                {tab === 'write' && !content.trim() ? (
                  <button type="button" className="link-btn" onClick={() => setContent(template(title.trim(), description.trim()))}>
                    Insert template
                  </button>
                ) : null}
                <div className="cl-switch" role="tablist" aria-label="Editor mode">
                  <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')}>Write</button>
                  <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</button>
                </div>
              </div>
            </div>
            <textarea
              className="code"
              name="content"
              aria-labelledby="content-lbl"
              placeholder={'# Skill name\nWhen should an agent use this skill?'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              hidden={tab !== 'write'}
            />
            {tab === 'preview' ? (
              <div className="md md-preview">
                {content.trim() ? <Markdown content={content} /> : <p>Nothing to preview yet. Write some Markdown first.</p>}
              </div>
            ) : null}
          </div>
          <p className="err-msg">{err('content')}</p>
        </div>

        <div>
          <button type="submit" className="btn-ember p-submit" disabled={pending}>{pending ? 'Publishing…' : 'Publish skill'}</button>
        </div>
      </form>

      <PaywallDialog
        feature={paywall}
        draft={{ title, description, stack, owner, tags, content }}
        onClose={() => setClosedFor(state)}
        onPublicInstead={() => {
          setVisibility('public');
          setClosedFor(state);
        }}
      />

      <aside className="p-aside" aria-label="Card preview">
        <p className="aside-lbl">How it will look in Explore</p>
        <div className={title.trim() ? 'skill' : 'skill ghost'}>
          <div className="skill-top">
            <span className="glyph"><SkillGlyph title={title.trim() || 'skill'} stars={0} /></span>
            <div className="skill-name">
              <h2>{title.trim() || 'Your skill title'}</h2>
              <span className="author">@{user?.username ?? ''}</span>
            </div>
          </div>
          <p>{description.trim() || 'Your one-sentence description shows up here.'}</p>
          <div className="meta">
            {stack ? <span className="fw">{stack}</span> : null}
            {previewTags.map((t, i) => <span key={`${t}-${i}`} className="tag">{t}</span>)}
            <span className="stars" aria-label="0 stars"><StarIcon />0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
