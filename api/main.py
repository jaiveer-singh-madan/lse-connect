"""LSE Connect API — not deployed yet, and nothing depends on it.

The React app reads bundled seed data until VITE_API_URL is set, so this can
sit here unused until you're ready. When you are: deploy it to Render (see the
root README), then point the frontend at it.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
    # http://localhost:8000/profiles  ·  http://localhost:8000/docs
"""

import csv
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# The prototype's CSV is the single source of truth until there's a database.
DATA_FILE = Path(os.environ.get("DATA_FILE", Path(__file__).parent.parent / "prototype" / "profiles.csv"))

# Comma-separated list in the env, e.g. "https://lse-connect.netlify.app".
# "*" is fine while this is public read-only data; tighten it before you add auth.
ALLOWED_ORIGINS = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "*").split(",")]

app = FastAPI(title="LSE Connect API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def read_profiles() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open(newline="", encoding="utf-8-sig") as handle:
        return [
            {key: (value or "").strip() for key, value in row.items() if key}
            for row in csv.DictReader(handle)
        ]


@app.get("/health")
def health() -> dict:
    """Hit this from a cron pinger if you want to keep a free dyno awake."""
    return {"ok": True, "profiles": len(read_profiles())}


@app.get("/profiles")
def profiles() -> list[dict]:
    return read_profiles()


@app.get("/tags")
def tags() -> list[str]:
    found = set()
    for profile in read_profiles():
        found.update(tag.strip() for tag in profile.get("tags", "").split(";") if tag.strip())
    return sorted(found)
