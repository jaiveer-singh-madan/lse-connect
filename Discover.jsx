import { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import ProfileCard from './ProfileCard.jsx';
import { allTags, filterProfiles, loadProfiles } from '../lib/profiles.js';
import { SIGNUP_HREF, SIGNUP_IS_EXTERNAL } from '../lib/config.js';

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    let cancelled = false;

    loadProfiles().then(({ profiles: loaded }) => {
      if (cancelled) return;
      setProfiles(loaded);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const tags = useMemo(() => allTags(profiles), [profiles]);
  const filtered = useMemo(
    () => filterProfiles(profiles, query, selectedTags),
    [profiles, query, selectedTags],
  );

  function toggleTag(tag) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  return (
    <>
      <Header />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, department, or interest..."
          aria-label="Search by name, department, or interest"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-lse focus:ring-1 focus:ring-lse"
        />

        <p className="mt-2 text-sm text-neutral-500">Filter by interest</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                className={
                  active
                    ? 'rounded-full bg-lse px-3 py-1 text-sm font-medium text-white'
                    : 'rounded-full border border-lse px-3 py-1 text-sm font-medium text-lse transition hover:bg-lse-tint'
                }
              >
                {tag}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-neutral-500">
          {loading ? 'Loading…' : `${filtered.length} students found`}
        </p>

        <div className="flex w-full flex-col gap-3">
          {filtered.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}

          {!loading && !filtered.length && (
            <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
              No students match that yet. Clear a filter, or request early access below.
            </p>
          )}

          <article className="w-full rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-lg font-bold">Not listed yet?</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Tell us your course, year and interests and you&rsquo;ll be in the next batch.
            </p>
            <a
              href={SIGNUP_HREF}
              target={SIGNUP_IS_EXTERNAL ? '_blank' : undefined}
              rel={SIGNUP_IS_EXTERNAL ? 'noopener' : undefined}
              className="mt-3 inline-block rounded-full bg-lse px-6 py-2 text-sm font-medium text-white transition hover:bg-lse-dark"
            >
              Early access
            </a>
          </article>
        </div>
      </main>
    </>
  );
}
