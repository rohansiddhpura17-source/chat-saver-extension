# Chat Saver - Implementation Status

## Screens (7 designed, 4 implemented)

### Screen 1: Popup ✅
- **Status**: Fully implemented and working
- **Description**: Chrome extension popup floating card (390px wide) showing conversation metrics, quick export button, and format selection
- **Key Features**:
  - Ambient backdrop with indigo/violet gradients
  - Simulated browser viewport mockup
  - Quick export with processing state
  - Format selection (PDF/Markdown)
  - Privacy assurance banner (100% on-device)
  - Full library navigation
- **Navigation**: Can navigate to Library, Export Config, and Library again

### Screen 2: Library ✅
- **Status**: Fully implemented and working
- **Description**: Chat library dashboard showing archived conversations with filtering by platform, tags, and search
- **Key Features**:
  - Conversation grid with 4 mock conversations
  - Filter by platform (ChatGPT, Google Gemini)
  - Favorites filtering
  - Search functionality
  - 42 total records display
- **Navigation**: Can navigate to Popup, Export Config, and Message Selection

### Screen 3: Export Config ✅
- **Status**: Fully implemented and working
- **Description**: Export settings and formatting engine with content scope, format presets, and page geometry
- **Key Features**:
  - Message scope selection (all, custom, prompts, responses)
  - Timestamps, code blocks, tables toggles
  - PDF theme presets (light, dark, minimal)
  - Page size (A4, US Letter) and margins
  - Filename pattern builder
  - Progress bar during export simulation
  - Cancel/Generate action buttons
- **Navigation**: Can navigate to Library, Popup, and Message Selection

### Screen 4: Message Selection ✅
- **Status**: Repaired 2026-11-10 — build verified (see Build Status)
- **Description**: Message selection interface for choosing specific messages to export
- **Key Features**:
  - 18 mock messages with prompt/response toggles
  - Select All / deselect all functionality
  - Filter pills (All, Prompts, AI Responses, Contains Code)
  - Message cards with checkbox selection
  - Selected count display
  - Export selected messages action
  - Clear selection functionality
- **Build Status** (verified 2026-11-10, after the repair):
  - `npx tsc -b --pretty false`: ✅ Exit 0 (was 24 errors)
  - `npx tsc -p tsconfig.app.json --noEmit`: ✅ Exit 0
  - `npx vite build`: ✅ Exit 0
  - `npm run build`: ✅ Exit 0
  - Note: a bare `npx tsc --noEmit` exits 0 vacuously because the root `tsconfig.json` has `"files": []` and only project references — it type-checks nothing. It must not be read as a passing check; `tsc -b` is the real check.
  - Note: `src/main.tsx` previously never mounted the app (no `createRoot` call), so the production bundle contained no app code even when it built. Mounting was added as part of the repair.

## Extension (verified 2026-11-10, after the build repair)
- `manifest.json` now loads: the missing assets were created — `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png` (indigo chat-bubble mark), `background.js` (MV3 service worker: on-device `chrome.storage.local` store, up to 50 conversations, dedupe by URL), `content.js` + `content.css` (real extraction from ChatGPT/Claude/Gemini/Copilot/Perplexity/Grok pages, floating "Save this chat" button on recognised chat hosts, inert elsewhere; roles are read from the page, never guessed; reports "no conversation found" instead of saving an empty one).
- `main.tsx` reads the latest captured conversation from `chrome.storage.local` when running as an extension (guarded by a runtime shape check) and shows it in the Popup instead of the demo conversation; outside the extension the demo stays.
- Styling is bundled, not CDN: Tailwind v4 via `@tailwindcss/vite`, tokens in `src/index.css` (`@theme`), CDN script + inline config removed from `index.html` / `popup.html`. This was required, not cosmetic — Manifest V3 extension pages block remote and inline scripts, so the CDN build could never style the popup. Bundled CSS is now 32.07 kB (was 0.05 kB); the `lightningcss @tailwind` build warnings are gone.
- `vite.config.ts` is a multi-page build (`index.html` + `popup.html` share one bundle) so the manifest's `default_popup` is a real built page.
- `npm run package:extension` (`npm run build && node scripts/package-extension.mjs`) copies `manifest.json`, `background.js`, `content.js`, `content.css`, `icons/` into `dist/` — `dist/` is the folder to load unpacked in Chrome.
- Extension QA in headless Chromium (script `~/workspace/chat-saver-qa/qa-extension.mjs`): **16/16 checks passed** — service worker starts, manifest reads, save button appears on a ChatGPT-shaped fixture page, click stores the conversation (4 messages, 1 code block, 1 table, title cleaned of the " — ChatGPT" suffix), popup mounts styled (`background #F8F9FF`) and shows the captured title/platform, 0 page/console errors. Functional QA of the four screens re-run after these changes: **27/27 checks passed** (the old "Tailwind CDN blocked" check was replaced — the CDN is gone).
- `tsconfig.app.json` now includes `"chrome"` in `types` (the project already depended on `@types/chrome`; the explicit list previously only had `vite/client`). No compiler setting was weakened.
- `package.json` gains `@tailwindcss/vite` (devDependency) and the `package:extension` script. The `build` script is unchanged.

## Navigation Flow
```
Popup (screen_1)
  └─▶ Library (screen_2)
       ├─▶ Export Config (screen_3)
       │    └─▶ Library (screen_2)
       │    └─▶ Message Selection (screen_4)
       └─▶ Message Selection (screen_4)
Popup (screen_1)
  └─▶ Message Selection (screen_4)
```

## Dependencies
- react: ^19.3.1
- react-dom: ^19.3.1
- @types/chrome: ^0.3.7
- tailwindcss: ^4.3.5
- typescript: ~7.0.2
- vite: ^8.3.6

## Build Commands
- `npm run dev` - Start development server
- `npx tsc -b --pretty false` - Type-check the app and node configs (the real type check)
- `npx tsc -p tsconfig.app.json --noEmit` - Type-check the app config only
- `npm run build` - Production build (`tsc -b && vite build`)

## Quick Export — real files (verified 2026-11-10)
- Quick Export is no longer simulated. `src/lib/export.ts` + `src/lib/pdf.ts` (no dependencies) generate real files from the captured conversation: Markdown (`.md`, title/platform/model/source/captured/metrics header, `## You` / `## <Platform>` sections) and PDF (dependency-free PDF 1.4 writer, Helvetica, A4, word-wrapped with real AFM widths, multi-page with page numbers, WinAnsi sanitisation with smart-punctuation mapping).
- Filenames follow the app's pattern `{{platform}}-{{date}}-{{title_slug}}`, e.g. `chatgpt-2026-11-10-attention-mechanisms.pdf`.
- Downloads use a Blob + anchor click, which works in the extension popup and in a normal tab. The button state is idle → processing → saved, plus an `error` state ("Export failed — try again") when the download cannot start.
- With no captured conversation (demo/preview), the export still writes a real file of what is on screen, and says plainly inside it that no messages were captured yet — it never invents message content.
- Export QA (`~/workspace/chat-saver-qa/qa-export.mjs`): **21/21 checks passed** — demo PDF/Markdown download with correct filenames, valid `%PDF` parsing via pypdf with the title present; captured-conversation PDF/Markdown from the extension popup contain the real fixture messages. PDF writer also unit-checked in Node: multi-page (3 pages, page numbers on each, first/last turn present), long-word hard split, unicode mapping.
- `main.tsx` now keeps the full captured conversation (validated by `isExportConversation` in the lib) and passes it to the Popup; the local `StoredConversation` type/guard moved into the lib as the single source of truth.

## Known limits (not build blockers)
- There is no test suite (`package.json` has no `test` script).
- Material Symbols icon font is never linked, so `material-symbols-outlined` ligatures render as plain text (visible in QA screenshots).
- Export Config's Generate button is still simulated (a timed progress bar); it does not yet use the export engine — Quick Export is the real path today.
- The PDF is a clean transcript (no syntax highlighting or tables rendering; code/text arrive as the page's plain text). Non-WinAnsi characters are mapped to ASCII equivalents or `?`.
- Content-script selectors match today's ChatGPT layout (`[data-message-author-role]`) with an `<article>` fallback; chat-site layouts drift, so extraction may need selector updates. Non-ChatGPT platforms currently extract with role `unknown`.
- Popup settings/close buttons are inert (no settings screen exists).
- `src/App.tsx` is the unused Vite template starter; `src/main.tsx` is the real entry point.
- The extension has been verified in headless Chromium on a fixture page, not yet on a real ChatGPT conversation in Chrome on the Mac.

## Next Steps
- Load `dist/` unpacked in Chrome on the Mac and save a real ChatGPT conversation end-to-end (see README section in the handoff).
- Wire Export Config's Generate button to the export engine (scope/format/filename pattern).
- Add a test suite (none exists today).
- Link the Material Symbols font (or replace the ligatures with inline SVG) so icons render.