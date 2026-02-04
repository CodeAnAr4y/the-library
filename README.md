# The Library

A web app to search books via the Open Library API and manage a personal Favorites list. Includes a Light/Dark theme switcher.

## Task
Task document: `https://drive.google.com/drive/folders/1lFXQWzc1vnfOxGiVT_zM-VkDCFyKmHfz?usp=sharing`

## How to run the app

### Requirements
- Node.js (LTS recommended)
- npm

### Install dependencies
```bash
npm install
```

### Run in development mode
```bash
npm run dev
```
Open the URL `http://localhost:5173`

### Build for production
```bash
npm run build
```
The production build will be generated in `dist/`

### Preview the production build locally
```bash
npm run preview
```
Open the URL `http://localhost:4173`

## Folder structure

- `public/` — Static files served “as is” in dev and copied to the production build.
  - **Stores:** static assets (e.g., images, fonts).
  - `public/assets/` — UI assets used by the interface.
    - **Stores:** icons/images (in this project mostly `.svg`: `book.svg`, `search.svg`, `heart.svg`, etc.).
  - `public/assets/theme/` — Assets for theme switching.
    - **Stores:** theme icons (`dark-mode-icon.svg`, `light-mode-icon.svg`).

- `src/` — Application source code (all runtime logic).
  - **Stores:** JavaScript source files (`.js`) organized by responsibility.
  - `src/api/` — Data/API layer.
    - **Stores:** API modules (`.js`) for Open Library requests (e.g., `openLibrary.js`).
  - `src/ui/` — UI layer.
    - **Stores:** UI modules (`.js`) for DOM rendering and UI states (e.g., `render.js`, `states.js`).
  - `src/utils/` — Shared utilities.
    - **Stores:** small helper modules (`.js`) such as debouncing and localStorage helpers (e.g., `debounce.js`, `storage.js`).
