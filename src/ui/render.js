import { coverUrl } from "../api/openLibrary.js";
import * as storage from "../utils/storage.js";
import * as openLibrary from "../api/openLibrary.js";

const results = document.getElementById("resultsGrid");

function renderBook(book, onToggleFavorite, favBooksIds) {
  const bookDiv = document.createElement("div");
  bookDiv.className = "book";
  bookDiv.id = book.id;
  const coverDiv = document.createElement("div");
  coverDiv.className = "cover";
  // append img or placeholder on book
  if (book.coverId) {
    const coverImg = document.createElement("img");
    coverImg.src = coverUrl(book.coverId);
    coverImg.alt = `${book.title} cover`;
    coverImg.loading = "lazy";
    coverDiv.appendChild(coverImg);
  } else {
    const coverPh = document.createElement("div");
    coverPh.className = "cover-placeholder";
    coverPh.textContent = "No cover";
    coverDiv.appendChild(coverPh);
  }
  // add favorite btn
  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  const favBtnImg = document.createElement("img");
  if (favBooksIds.includes(book.id)) {
    favBtnImg.src = "/assets/heart-active.svg";
  } else {
    favBtnImg.src = "/assets/heart.svg";
  }
  favBtn.appendChild(favBtnImg);
  coverDiv.appendChild(favBtn);

  favBtn.addEventListener("click", () => onToggleFavorite(book));

  // add meta data on book
  const metaDiv = document.createElement("div");
  metaDiv.className = "meta";
  //   title
  const bookTitleH3 = document.createElement("h3");
  bookTitleH3.className = "book-title";
  bookTitleH3.textContent = book.title;
  //   author
  const bookAuthorP = document.createElement("p");
  bookAuthorP.className = "book-author";
  bookAuthorP.textContent = book.authors?.[0] || "Unknown author";
  //   year
  const bookYearP = document.createElement("p");
  bookYearP.className = "book-year";
  bookYearP.textContent = book.years ? String(book.years) : "";

  // card assembly
  metaDiv.append(bookTitleH3, bookAuthorP, bookYearP);
  bookDiv.append(coverDiv, metaDiv);
  results.appendChild(bookDiv);
}

export function renderBooks(list, toggleFavorite) {
  const favBooksIds = storage.getFavorite().map((book) => book.id);
  results.innerHTML = "";
  for (const book of list) {
    renderBook(book, toggleFavorite, favBooksIds);
  }
}

// Render function for books on like toggle
export function toggleFavoriteRender(book) {
  const bookTag = document.getElementById(book.id);
  if (!bookTag) return;

  const favBtn = bookTag.querySelector(".fav-btn");
  if (!favBtn) return;

  const favBtnImg = favBtn.querySelector("img");
  if (!favBtnImg) return;

  favBtnImg.src = favBtnImg.src.includes("heart-active.svg")
    ? "/assets/heart.svg"
    : "/assets/heart-active.svg";
}

function createFavItem(book, onToggleFavorite) {
  const el = document.createElement("div");
  el.className = "fav-item";
  el.dataset.id = String(book.id);

  const content = document.createElement("div");
  content.className = "fav-book-content";

  // cover block
  const coverWrap = document.createElement("div");
  coverWrap.className = "fav-cover";

  if (book.coverId) {
    const img = document.createElement("img");
    img.src = openLibrary.coverUrl(book.coverId);
    img.alt = "";
    img.loading = "lazy";
    coverWrap.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "cover-placeholder";
    ph.style.fontSize = '10px'
    ph.textContent = "No cover";
    coverWrap.appendChild(ph);
  }

  // text
  const text = document.createElement("div");
  text.className = "fav-book-text";
  text.innerHTML = `
      <h5>${book.title}</h5>
      <p>${book.authors?.[0] || "Unknown author"}</p>
      <p class="fav-book-year">${book.years ?? ""}</p>
    `;

  content.append(coverWrap, text);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fav-sec-btn";
  btn.innerHTML = `<img class="fav-btn-img" src="/assets/heart-active.svg" alt="Liked" />`;
  btn.addEventListener("click", () => onToggleFavorite(book));

  el.append(content, btn);
  return el;
}

export function patchFavBooksSection(book, onToggleFavorite) {
  const favBooks = storage.getFavorite();
  const isFav = favBooks.some((b) => b.id === book.id);

  const favListTag = document.getElementById("favList");
  const booksCount = document.getElementById("booksCount");

  const selector = `.fav-item[data-id="${CSS.escape(String(book.id))}"]`;
  const existing = favListTag.querySelector(selector);

  if (isFav && !existing)
    favListTag.prepend(createFavItem(book, onToggleFavorite));
  if (!isFav && existing) existing.remove();

  booksCount.textContent = `${favBooks.length} books saved`;
}

export function initFavBooksSection(onToggleFavorite) {
  const favBooks = storage.getFavorite();
  const booksCount = document.getElementById("booksCount");
  const favListTag = document.getElementById("favList");

  favListTag.innerHTML = "";
  for (const book of favBooks) {
    favListTag.appendChild(createFavItem(book, onToggleFavorite));
  }
  booksCount.textContent = `${favBooks.length} books saved`;
}
