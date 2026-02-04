const elLoading = document.getElementById("loading");
const elNotFound = document.getElementById("notFound");
const elEmpty = document.getElementById("empty");
const elGrid = document.getElementById("resultsGrid");

function hideAllStates() {
  elLoading?.classList.remove("is-active");
  elNotFound?.classList.remove("is-active");
  elEmpty?.classList.remove("is-active");
}

export function showState(name) {
  hideAllStates();

  if (name === "loading") elLoading?.classList.add("is-active");
  else if (name === "notFound") elNotFound?.classList.add("is-active");
  else if (name === "empty") elEmpty?.classList.add("is-active");
  else console.error(`Unknown state: ${name}`);
}

export function hideStates() {
  hideAllStates();
}

export function setResultsVisible(visible) {
  if (!elGrid) return;
  elGrid.style.display = visible ? "" : "none";
}