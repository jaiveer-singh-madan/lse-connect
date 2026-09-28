import { Link } from 'react-router-dom';
import { SIGNUP_HREF, SIGNUP_IS_EXTERNAL } from '../lib/config.js';

export default function Landing() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold text-lse">LSE Connect</h1>

      <span className="rounded bg-lse-tint px-2.5 py-1 text-xs font-medium tracking-wide text-lse">
        Early Access
      </span>

      <p className="max-w-md text-neutral-500">
        Verified LSE-only network. Find seniors &amp; alumni who&rsquo;ve done what
        you&rsquo;re about to do.
      </p>

      <a
        href={SIGNUP_HREF}
        target={SIGNUP_IS_EXTERNAL ? '_blank' : undefined}
        rel={SIGNUP_IS_EXTERNAL ? 'noopener' : undefined}
        className="mt-2 rounded-full bg-lse px-8 py-3 font-medium text-white shadow-md transition hover:bg-lse-dark"
      >
        &darr; Early access
      </a>

      <Link to="/discover" className="text-sm text-neutral-500 underline-offset-4 hover:underline">
        Browse the directory
      </Link>
    </main>
  );
}
