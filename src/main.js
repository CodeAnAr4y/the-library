import { storage, setTheme } from "./utils/storage.js";

const els = {
  themeBtn: document.getElementById("themeBtn"),
  themeIcon: document.getElementById("themeIcon"),
};

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

els.themeBtn.addEventListener("click", toggleTheme);

setInitTheme();