import { Link } from 'react-router-dom';
import { SIGNUP_HREF, SIGNUP_IS_EXTERNAL } from '../lib/config.js';

export default function Header({ action = 'signup' }) {
  return (
    <header className="flex w-full items-center justify-between gap-4 bg-lse p-4">
      <Link to="/" className="text-xl font-bold text-white">
        LSE Connect
      </Link>

      {action === 'signup' ? (
        <a
          href={SIGNUP_HREF}
          target={SIGNUP_IS_EXTERNAL ? '_blank' : undefined}
          rel={SIGNUP_IS_EXTERNAL ? 'noopener' : undefined}
          className="rounded-full border border-white/70 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/15"
        >
          Early access
        </a>
      ) : (
        <Link
          to="/discover"
          className="rounded-full border border-white/70 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/15"
        >
          Browse students
        </Link>
      )}
    </header>
  );
}
