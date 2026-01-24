# PulaVocab
 
PulaVocab is a React + Vite + Tailwind app that generates English sentences from your keywords using Google Gemini, translates them to Vietnamese, and highlights grammar components. Save generated cards locally and practice with text-to-speech.

## Requirements
- Node.js 18+
- PowerShell (Windows)
- A Google Gemini API key

## Setup
1. Clone or open this folder in VS Code.
2. Create `.env.local` from the example:
   ```
   copy .env.example .env.local
   ```
3. Edit `.env.local` and set `VITE_GEMINI_API_KEY` to your key.

## Install & Run
```powershell
npm install
npm run dev
```
App runs at http://localhost:5173.

## Build
```powershell
npm run build
npm run preview
```

## Notes
- Environment variables: `VITE_GEMINI_API_KEY`, optional `VITE_GEMINI_MODEL`.
- Data persistence uses `localStorage` under key `duo_vocab_ai`.
- Icons: [lucide-react]. Tailwind is already configured.

## UI Components
- Components are extracted under `src/components/` for reuse:
   - `Button.tsx`: shared button styles and variants
   - `Tag.tsx`: grammar type label
   - `Sidebar.tsx`: desktop navigation and branding
   - `MobileNav.tsx`: mobile bottom navigation
   - `ResultCard.tsx`: generated sentence, analysis, and actions
This keeps `App.tsx` focused on data/state and orchestration.

## Firebase Setup (for cloud save + Google login)
- Create a Firebase project and enable Firestore and Authentication.
- In Authentication → Sign-in method, enable Google provider.
- In Authentication → Settings, add authorized domains: `localhost`, `127.0.0.1`, and your dev host.
- Create `.env.local` with your project values:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - Optional: `VITE_FIREBASE_MEASUREMENT_ID`
- Firestore rules example (restrict reads/writes to the authenticated user):
```
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /users/{userId}/cards/{cardId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
      }
   }
}
```
If login fails, verify the above and check that `.env.local` is loaded (restart `npm run dev` after changes).
