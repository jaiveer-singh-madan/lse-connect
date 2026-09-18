# LSE Connect

Verified LSE-only network. Find seniors and alumni who've done what you're
about to do.

Right now this repo ships one thing: an early-access signup site. The rest is
scaffolding for later, deliberately inert so it can't break the deploy.

```
web/         React + Vite + Tailwind. This is what goes live on Netlify.
api/         FastAPI service. Written, tested, NOT deployed yet.
prototype/   The original NiceGUI app. Runs as-is; the design reference.
netlify.toml Build + redirect config. Netlify reads this from the root.
```

## Get the site live (about 10 minutes)

**1. Push this to GitHub.** New repo, then from the folder:

```bash
git init
git add .
git commit -m "LSE Connect: early access site"
git branch -M main
git remote add origin https://github.com/<you>/lse-connect.git
git push -u origin main
```

**2. Connect it to Netlify.** app.netlify.com → Add new site → Import an
existing project → GitHub → pick the repo. Netlify reads `netlify.toml`, so
leave the build settings alone: base `web`, command `npm run build`, publish
`dist`. Deploy.

**3. You're live** at `https://<random-name>.netlify.app`. Site configuration →
Change site name to get something sane like `lse-connect.netlify.app`.

That's it. No environment variables needed for the first deploy — signups go to
the built-in `/signup` page and land in Netlify's dashboard.

## Where the signups go

Two options. Pick one.

**Netlify Forms (default, nothing to set up).** The `/signup` page posts to
Netlify, submissions appear under Project → Forms, and you can turn on email
notifications there. Form submissions are free and unlimited on the current
plans.

One catch worth knowing: Netlify detects forms by parsing static HTML at deploy
time, and a React-rendered form isn't there to find. That's what
`web/public/__forms.html` is — a hidden static declaration Netlify can see. If
you add a field to the signup form, add it there too or that field arrives empty.
Forms also don't work on `localhost`, only on a deployed site.

**A Google Form instead.** Set `VITE_FORM_URL` in Netlify (Site configuration →
Environment variables) to your form's share link. Every "Early access" button
then opens the Google Form in a new tab and `/signup` goes unused. Responses
land in a Sheet the whole team can see. Redeploy after setting it — Vite bakes
env vars in at build time.

## Local development

```bash
cd web
npm install
npm run dev        # http://localhost:5173
```

Copy `web/.env.example` to `web/.env.local` if you want to test with a form URL
or an API. The NiceGUI prototype still runs on its own:

```bash
cd prototype
pip install -r requirements.txt
python main.py     # http://localhost:8080
```

## Watch the free-tier limits

The free Netlify plan is 300 credits a month and it's a hard cap — run out and
every site on the team pauses until the cycle resets. A successful production
deploy costs 15 credits, so that's roughly **20 production deploys a month**.
With four people pushing, you will hit it.

So: work on branches and open pull requests. Deploy previews and branch deploys
are free and unlimited, and each PR gets its own URL you can share. Merge to
`main` only when you actually want a release. Failed deploys are free too.

## Phase 2: turning on the Python API

The frontend already handles this. `web/src/lib/profiles.js` reads bundled seed
data while `VITE_API_URL` is empty, calls the API when it isn't, and falls back
to the seed if the API errors — so a sleeping service degrades instead of
showing an empty page.

1. Deploy `api/` to Render: New → Web Service → this repo, **Root Directory**
   `api`, build `pip install -r requirements.txt`, start
   `uvicorn main:app --host 0.0.0.0 --port $PORT`.
2. Uncomment the `/api/*` redirect in `netlify.toml` and put your Render URL in
   it. Keep it above the SPA fallback.
3. Set `VITE_API_URL=/api` in Netlify's environment variables and redeploy.

Free Render services sleep after 15 minutes idle and take about a minute to wake.
Fine for a demo, not for a launch. When you need real data, put Postgres on Neon
rather than reading a CSV — Render's free filesystem is wiped on every restart.

## Vercel instead?

Works, with two differences: set the root directory to `web` (framework
preset Vite, it'll detect the rest), and add rewrites for React Router since
`netlify.toml` is ignored. But you'd lose Netlify Forms, so you'd need the
Google Form route. Vercel's upside is that it *does* run Python serverless
functions, so `api/` could live in the same deploy.

## Seed data

`web/src/data/profiles.json` is demo data for the directory page, and it's
public once deployed. Replace the two non-founder profiles with fake ones, or
get permission, before you share the link widely. `prototype/profiles.csv` is
the same data for the NiceGUI app and the API.
