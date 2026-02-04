import * as storage from "./utils/storage.js";
import { debounce } from "./utils/debounce.js";
import * as openLibrary from "./api/openLibrary.js";
import * as render from "./ui/render.js";
import * as states from "./ui/states.js";

const TRENDING_BOOKS_QUERY = {
  query:
    'trending_score_hourly_sum:[1 TO *] readinglog_count:[4 TO *] language:rus -subject:"content_warning:cover" -subject:"content_warning:cover"',
  sort: "trending",
};

const els = {
  themeBtn: document.getElementById("themeBtn"),
  themeIcon: document.getElementById("themeIcon"),
  searchInput: document.getElementById("searchInput"),
  searchBtn: document.getElementById("searchBtn"),
  authorSelect: document.getElementById("authorSelect"),
};

// Cache last fetched results (unfiltered)
let lastBooks = [];

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

// Authors helpers
function getAuthors(book) {
  // English-only comments: support multiple possible shapes from API/mappers
  if (Array.isArray(book.author_name)) return book.author_name.filter(Boolean);
  if (Array.isArray(book.authors)) return book.authors.filter(Boolean);
  if (typeof book.author === "string" && book.author.trim())
    return [book.author.trim()];
  if (typeof book.authorName === "string" && book.authorName.trim())
    return [book.authorName.trim()];
  return [];
}

function buildUniqueAuthors(books) {
  const set = new Set();
  for (const b of books) {
    for (const name of getAuthors(b)) set.add(name);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function setAuthorOptions(books) {
  if (!els.authorSelect) return;

  const prev = els.authorSelect.value;
  const authors = buildUniqueAuthors(books);

  els.authorSelect.innerHTML = "";
  els.authorSelect.append(new Option("All authors", ""));

  for (const name of authors) {
    els.authorSelect.append(new Option(name, name));
  }

  // Keep selection if still available
  if (authors.includes(prev)) els.authorSelect.value = prev;
  else els.authorSelect.value = "";
}

function applyAuthorFilter(books) {
  const selected = (els.authorSelect?.value || "").trim();
  if (!selected) return books;

  return books.filter((b) => getAuthors(b).includes(selected));
}

function renderWithFilters() {
  const filtered = applyAuthorFilter(lastBooks);

  if (!lastBooks.length) {
    states.showState("empty");
    states.setResultsVisible(false);
    render.renderBooks([], toggleFavorite);
    return;
  }

  if (!filtered.length) {
    states.showState("notFound");
    states.setResultsVisible(false);
    render.renderBooks([], toggleFavorite);
    return;
  }

  states.hideStates();
  states.setResultsVisible(true);
  render.renderBooks(filtered, toggleFavorite);
}

// Searching
async function search(rawQuery) {
  const query = rawQuery.trim();

  if (!query) {
    return searchTrendingBooks(
      TRENDING_BOOKS_QUERY.query,
      TRENDING_BOOKS_QUERY.sort
    );
  }

  states.showState("loading");
  states.setResultsVisible(false);

  try {
    lastBooks = await openLibrary.searchBooks(query);
    setAuthorOptions(lastBooks);
    renderWithFilters();
  } catch (e) {
    console.error(e);
    lastBooks = [];
    setAuthorOptions(lastBooks);
    states.showState("notFound");
    states.setResultsVisible(false);
  }
}

async function searchTrendingBooks(rawQuery, sort) {
  states.showState("loading");
  states.setResultsVisible(false);

  try {
    const query = (rawQuery || "").trim();
    lastBooks = await openLibrary.searchBooks(query, sort);
    setAuthorOptions(lastBooks);
    renderWithFilters();
  } catch (e) {
    console.error(e);
    lastBooks = [];
    setAuthorOptions(lastBooks);
    states.showState("notFound");
    states.setResultsVisible(false);
  }
}

const debounceSearch = debounce(() => search(els.searchInput.value), 450);

// Toggle Favorite
function toggleFavorite(book) {
  storage.toggleFavoriteStorage(book);
  render.toggleFavoriteRender(book);
  render.patchFavBooksSection(book, toggleFavorite);
}

// Event listeners
els.themeBtn.addEventListener("click", toggleTheme);
els.searchInput.addEventListener("input", debounceSearch);
els.searchBtn.addEventListener("click", () => search(els.searchInput.value));

els.authorSelect?.addEventListener("change", () => {
  renderWithFilters();
});

// Init
setInitTheme();
searchTrendingBooks(TRENDING_BOOKS_QUERY.query, TRENDING_BOOKS_QUERY.sort);
render.initFavBooksSection(toggleFavorite);
