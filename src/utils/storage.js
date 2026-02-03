const THEME_KEY = "theme";

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
