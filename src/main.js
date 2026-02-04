import * as storage from "./utils/storage.js";
import { debounce } from "./utils/debounce.js";
import * as openLibrary from "./api/openLibrary.js";
import * as render from "./ui/render.js";

const TRENDING_BOOKS_QUERY = {
  query:
    'trending_score_hourly_sum:[1 TO *] readinglog_count:[4 TO *] language:rus -subject:"content_warning:cover" -subject:"content_warning:cover"',
  sort: "trending",
};

const els = {
  themeBtn: document.getElementById("themeBtn"),
  themeIcon: document.getElementById("themeIcon"),
  searchInput: document.getElementById("searchInput"),
};

// Theming
function getThemeIconSrc(theme) {
  return theme === "light"
    ? "/assets/theme/light-mode-icon.svg"
    : "/assets/theme/dark-mode-icon.svg";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (els.themeIcon) els.themeIcon.src = getThemeIconSrc(theme);
}

function setInitTheme() {
  applyTheme(storage.storage.theme);
}

function toggleTheme() {
  const newTheme = storage.storage.theme === "light" ? "dark" : "light";
  storage.setTheme(newTheme);
  applyTheme(newTheme);
}

// Searching
async function search(rawQuery) {
  const query = rawQuery.trim();
  if (!query) {
    searchTrendingBooks(TRENDING_BOOKS_QUERY.query, TRENDING_BOOKS_QUERY.sort);
    return;
  }
  const listOfBooks = await openLibrary.searchBooks(query);
  render.renderBooks(listOfBooks, toggleFavorite);
}

async function searchTrendingBooks(rawQuery, sort) {
  const query = (rawQuery || "").trim();
  const list = await openLibrary.searchBooks(query, sort);
  render.renderBooks(list, toggleFavorite);
}

const debounceSearch = debounce(() => search(els.searchInput.value), 450);

// Toggle Favorite
function toggleFavorite(book) {
  storage.toggleFavoriteStorage(book);
  render.toggleFavoriteRender(book);
  render.patchFavBooksSection(book, toggleFavorite);
}

// Event Listeners
els.themeBtn.addEventListener("click", toggleTheme);

els.searchInput.addEventListener("input", debounceSearch);

setInitTheme();
searchTrendingBooks(TRENDING_BOOKS_QUERY.query, TRENDING_BOOKS_QUERY.sort);
render.initFavBooksSection(toggleFavorite);
