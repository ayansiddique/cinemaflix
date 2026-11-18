import fs from "fs";
import path from "path";
import { MovieItem, DEFAULT_MOVIES } from "./defaultMovies";

// In-memory store across requests in the same process
const globalStore = globalThis as unknown as {
  __CUSTOM_MOVIES__: MovieItem[] | undefined;
};

if (!globalStore.__CUSTOM_MOVIES__) {
  globalStore.__CUSTOM_MOVIES__ = [];
}

const getTmpFilePath = () => path.join("/tmp", "cinemaflix_custom_movies.json");

export function getCustomMovies(): MovieItem[] {
  let list = [...(globalStore.__CUSTOM_MOVIES__ || [])];

  // Try reading from /tmp on serverless
  try {
    const tmpPath = getTmpFilePath();
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Merge without duplicates
        const ids = new Set(list.map((m) => m.id));
        for (const item of parsed) {
          if (!ids.has(item.id)) {
            list.unshift(item);
            ids.add(item.id);
          }
        }
      }
    }
  } catch (e) {
    // Ignore read errors
  }

  return list;
}

export function saveCustomMovie(movie: MovieItem): void {
  if (!globalStore.__CUSTOM_MOVIES__) {
    globalStore.__CUSTOM_MOVIES__ = [];
  }

  // Prepend to memory
  globalStore.__CUSTOM_MOVIES__ = [
    movie,
    ...globalStore.__CUSTOM_MOVIES__.filter((m) => m.id !== movie.id && m.slug !== movie.slug),
  ];

  // Persist to /tmp writable disk on serverless
  try {
    const tmpPath = getTmpFilePath();
    fs.writeFileSync(tmpPath, JSON.stringify(globalStore.__CUSTOM_MOVIES__, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write to /tmp:", e);
  }
}
