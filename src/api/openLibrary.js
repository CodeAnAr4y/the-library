const BASE = "https://openlibrary.org/search.json";

export async function searchBooks(query) {
  const url = new URL(BASE);
  url.searchParams.set("q", query);
  const res = await fetch(url.toString());
  const data = await res.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];
  return docs.map((doc) => ({
    title: doc.title ?? "Untitled",
    authors: Array.isArray(doc.author_name) ? doc.author_name : [],
    years: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }));
}

export function coverUrl(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}.jpg`;
}
