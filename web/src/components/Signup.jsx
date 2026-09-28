import { useState } from 'react';
import Header from './Header.jsx';

const FORM_NAME = 'early-access';

// Netlify detects forms by parsing static HTML at deploy time, and a
// React-rendered form isn't there to find. So the form is declared in
// public/__forms.html and we post to that path. Don't delete that file.
const POST_TO = '/__forms.html';

export default function Signup() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');

    const data = new FormData(event.target);
    data.append('form-name', FORM_NAME);

    try {
      const response = await fetch(POST_TO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
    } catch (error) {
      console.error('Signup failed:', error);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <>
        <Header action="browse" />
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4">
          <h1 className="text-2xl font-bold">You&rsquo;re on the list</h1>
          <p className="text-neutral-500">
            We&rsquo;ll email you when your profile is live. In the meantime, have a look at
            who&rsquo;s already on here.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header action="browse" />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4">
        <h1 className="text-2xl font-bold">Early access</h1>
        <p className="text-sm text-neutral-500">
          Course, year and a few interests. Takes about a minute.
        </p>

        <form name={FORM_NAME} onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
          <Field name="name" label="Full name" required />
          <Field name="email" label="LSE email" type="email" placeholder="you@lse.ac.uk" required />
          <Field name="year" label="Year" placeholder="Year 2, Final Year, Alumni…" required />
          <Field name="department" label="Course or department" required />
          <Field name="interests" label="Interests" placeholder="Finance; Career; Maths" required />

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">One line about you</span>
            <textarea
              name="bio"
              rows={3}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-base outline-none focus:border-lse focus:ring-1 focus:ring-lse"
            />
          </label>

          {/* Spam trap — matches netlify-honeypot in public/__forms.html */}
          <p className="hidden">
            <label>
              Leave blank: <input name="bot-field" />
            </label>
          </p>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-1 rounded-full bg-lse px-8 py-3 font-medium text-white shadow-md transition hover:bg-lse-dark disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Request early access'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-lse">
              That didn&rsquo;t send. Netlify Forms only works on a deployed site, not on
              localhost — try again once this is live.
            </p>
          )}
        </form>
      </main>
    </>
  );
}

function Field({ label, name, type = 'text', placeholder, required }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-base outline-none focus:border-lse focus:ring-1 focus:ring-lse"
      />
    </label>
  );
}
