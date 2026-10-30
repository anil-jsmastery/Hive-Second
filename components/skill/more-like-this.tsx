import Link from 'next/link';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { StarIcon } from '@/components/night/icons';
import { relatedSkills } from '@/lib/queries/related';

export async function MoreLikeThis({ skill }: { skill: { slug: string; stack: string; tags: string[] } }) {
  const related = await relatedSkills(skill);
  if (!related.length) return null;

  return (
    <section className="side-card">
      <h2 className="side-title">More like this</h2>
      <ul className="mini-list">
        {related.map((r) => (
          <li key={r.slug}>
            <Link href={`/s/${r.slug}`}>
              <span className="glyph xs"><SkillGlyph title={r.title} stars={r.stars_count} /></span>
              <span className="mini-txt">
                <b>{r.title}</b>
                {r.author ? <span>@{r.author.handle}</span> : null}
              </span>
              <span className="mini-stars"><StarIcon />{r.stars_count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
