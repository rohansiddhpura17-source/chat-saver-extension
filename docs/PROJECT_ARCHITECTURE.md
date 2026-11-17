# Chat Saver - Project Architecture

## Overview
Chat Saver is a Chrome Extension (Manifest V3) for privacy-first export of AI conversations into PDF, Markdown, and TXT files. It runs entirely on-device with no cloud, no auth, and no external APIs.

## Tech Stack
- **React 19** with TypeScript
- **Vite** for dev server and build
- **Tailwind CSS** v4 for styling with design tokens from DESIGN.md
- **Lucide React** for icons
- **Chrome Extension MV3** with service worker, content scripts, and popup

## Project Structure
```
src/
  main.tsx          - Root React component, screen navigation
  pages/
    popup/Popup.tsx     - Screen 1: Chrome extension popup (390px floating card)
    library/Library.tsx - Screen 2: Chat library dashboard
    export-config/ExportConfig.tsx - Screen 3: Export configuration
    message-selection/MessageSelection.tsx - Screen 4: Message selection interface
  App.tsx           - Original Vite App component (not used as root)
  index.css         - Global CSS with @tailwind directives
  types/            - TypeScript type definitions
components/         - Reusable React components (currently empty)
hooks/             - Custom React hooks (currently empty)
lib/               - Utility libraries (currently empty)
styles/            - CSS styles (currently empty)

extension/
  background/     - Service worker background script
  icons/          - Extension icon assets (16px, 48px, 128px)

public/
  docs/           - Documentation directory
  icons/          - Public icon assets

tailwind.config.js - Design tokens (colors, spacing, radii, shadows)
vite.config.ts    - Vite config with React plugin
postcss.config.js - PostCSS config (removed for Tailwind CSS v4)
manifest.json     - Chrome Extension MV3 manifest

## Screen Navigation
The app uses a screen-state machine in `src/main.tsx`:
- State: `'popup' | 'library' | 'export-config' | 'message-selection'`
- Navigation function: `navigateTo(screen, conversation?)` 
- Screens transition: Popup ↔ Library ↔ Export Config ↔ Message Selection

## Key Components
- **Popup** (screen_1): Floating card (390px) showing conversation metrics and quick export
- **Library** (screen_2): Chat library dashboard with filtering and search
- **ExportConfig** (screen_3): Export settings with format, theme, and page geometry options
- **MessageSelection** (screen_4): Interface for selecting specific messages for export

## Known Build Issues
- `tsc --noEmit` passes with no errors
- `npm run build` (`tsc -b && vite build`) fails due to JSX parsing issues in MessageSelection.tsx at lines 444-445
- Development mode (`npm run dev`) works correctly
- Production build can be run with known limitations (see README)

## Development Commands
- `npm run dev` - Start development server at http://localhost://3000
- `npm run build` - Attempt production build (has known issues with MessageSelection.tsx)
- `npx tsc --noEmit` - Type-check only (passes with no errors)