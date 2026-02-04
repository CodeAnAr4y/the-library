const THEME_KEY = "theme";
const FAVORITE_BOOKS_KEY = "favorite_books";

export const storage = {
  theme: loadTheme(),
};

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
}

export function setTheme(mode) {
  storage.theme = mode;
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {}
}

export function getFavorite() {
  try {
    const books = localStorage.getItem(FAVORITE_BOOKS_KEY);
    return books ? JSON.parse(books) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteStorage(book) {
  let favBooks = getFavorite();

  const exists =
    favBooks.length > 0 ? favBooks.some((b) => b?.id === book.id) : null;
  if (exists) {
    favBooks = favBooks.filter((b) => b?.id !== book.id);
  } else {
    favBooks.push(book);
  }

  try {
    localStorage.setItem(FAVORITE_BOOKS_KEY, JSON.stringify(favBooks));
  } catch {}

}
