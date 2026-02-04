const BASE = "https://openlibrary.org/search.json";

export async function searchBooks(query, sort) {
  const url = new URL(BASE);
  url.searchParams.set("q", query);
  if (sort) {
    url.searchParams.set("sort", sort);
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];
  return docs.map((doc) => ({
    id: doc.key ?? `${doc.title ?? ""}:${doc.author_name?.[0] ?? ""}:${doc.first_publish_year ?? ""}`,
    title: doc.title ?? "Untitled",
    authors: Array.isArray(doc.author_name) ? doc.author_name : [],
    years: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }));
}

export function coverUrl(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}.jpg`;
}
