import { tagsOf } from '../lib/profiles.js';
import { SIGNUP_HREF, SIGNUP_IS_EXTERNAL } from '../lib/config.js';

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function ProfileCard({ profile }) {
  const linkProps = {
    href: SIGNUP_HREF,
    target: SIGNUP_IS_EXTERNAL ? '_blank' : undefined,
    rel: SIGNUP_IS_EXTERNAL ? 'noopener' : undefined,
  };

  return (
    <article className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lse text-sm font-medium text-white">
          {initials(profile.name)}
        </div>
        <div>
          <div className="text-lg font-bold leading-tight">{profile.name}</div>
          <div className="text-sm text-neutral-500">
            {profile.year} &middot; {profile.department}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm">{profile.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {tagsOf(profile).map((tag) => (
          <span key={tag} className="rounded bg-lse-tint px-1.5 py-0.5 text-xs font-medium text-lse">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <a
          {...linkProps}
          className="grow rounded-full bg-lse py-2 text-center text-sm font-medium text-white transition hover:bg-lse-dark"
        >
          Connect
        </a>
        <a
          {...linkProps}
          className="grow rounded-full border border-lse py-2 text-center text-sm font-medium text-lse transition hover:bg-lse-tint"
        >
          Message
        </a>
      </div>
    </article>
  );
}
