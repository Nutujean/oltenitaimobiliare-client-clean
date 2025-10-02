// src/utils/favorites.js
const KEY = "favIds";

export function getFavIds() {
  try {
    const raw = localStorage.getItem(KEY);
    return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFav(id) {
  return getFavIds().includes(id);
}

export function toggleFav(id) {
  const ids = getFavIds();
  const i = ids.indexOf(id);
  if (i >= 0) ids.splice(i, 1);
  else ids.unshift(id);
  localStorage.setItem(KEY, JSON.stringify(ids));
  return ids;
}

export function setFavIds(ids) {
  const unique = [...new Set(ids)];
  localStorage.setItem(KEY, JSON.stringify(unique));
  return unique;
}
