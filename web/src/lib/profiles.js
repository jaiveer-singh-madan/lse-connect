import { API_URL } from './config.js';
import seed from '../data/profiles.json';

/**
 * Phase 1: no API, so this returns the bundled seed data.
 * Phase 2: set VITE_API_URL (to /api if you use the netlify.toml proxy) and
 * the same components start reading from the Python service instead. If the
 * API is asleep or erroring, we fall back to the seed rather than showing
 * an empty page.
 */
export async function loadProfiles() {
  if (!API_URL) return { profiles: seed, source: 'seed' };

  try {
    const response = await fetch(`${API_URL}/profiles`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { profiles: data, source: 'api' };
  } catch (error) {
    console.error('Falling back to seed data:', error);
    return { profiles: seed, source: 'seed' };
  }
}

export function tagsOf(profile) {
  return String(profile.tags || '')
    .split(';')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function allTags(profiles) {
  const seen = new Set();
  profiles.forEach((profile) => tagsOf(profile).forEach((tag) => seen.add(tag)));
  return [...seen].sort((a, b) => a.localeCompare(b));
}

/** Same rules as matches() in prototype/main.py. */
export function filterProfiles(profiles, query, selectedTags) {
  const needle = query.trim().toLowerCase();

  return profiles.filter((profile) => {
    const haystack = `${profile.name} ${profile.department} ${profile.tags}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return false;

    if (selectedTags.length) {
      const mine = tagsOf(profile);
      if (!selectedTags.every((tag) => mine.includes(tag))) return false;
    }
    return true;
  });
}
