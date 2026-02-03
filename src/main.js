import { storage, setTheme } from "./utils/storage.js";
import { debounce } from "./utils/debounce.js";
import { searchBooks } from "./api/openLibrary.js";

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
  applyTheme(storage.theme);
}

function toggleTheme() {
  const newTheme = storage.theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  applyTheme(newTheme);
}

// Searching
async function search(rawQuery) {
  const query = (rawQuery || "").trim();
  const listOfBooks = await searchBooks(query);
  console.log(listOfBooks);
}

const debounceSearch = debounce(() => search(els.searchInput.value), 450);

// Event Listeners
els.themeBtn.addEventListener("click", toggleTheme);

els.searchInput.addEventListener("input", debounceSearch);

setInitTheme();
