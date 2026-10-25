# TaskFlow — Organize. Focus. Achieve.

A production-ready task management web app built with React, Material UI, and React Router.

## Features

- Dashboard with live stats, today's/upcoming tasks, priority & status breakdown, recent activity
- Full task CRUD: title, description, image upload with preview, due date/time, priority, status, category, tags
- All Tasks / Today / Upcoming / Completed views with search, filters, and sorting
- Month / Week / Day calendar with tasks plotted on their due date
- Full Arabic + English support, including live RTL/LTR switching (saved to localStorage)
- Light / Dark mode (saved to localStorage)
- Responsive sidebar (desktop) that becomes a mobile drawer, responsive header, cards, forms, calendar
- Toast notifications (create/update/delete/complete), delete confirmation with undo
- Empty states, skeleton-friendly structure, accessible controls, keyboard-friendly forms
- All data (tasks, theme, language, settings) persisted to `localStorage`

## Tech stack

React 18 · Vite · Material UI (MUI) v6 · React Router v6 · date-fns · notistack (toasts) · uuid

## Getting started

```bash
npm install
npm start
```

The app runs at `http://localhost:5173`.

## Setting up login (Firebase Authentication)

The app now has a login/signup flow backed by Firebase Authentication (email + password).
Every page except `/login` and `/signup` is protected — signed-out users get redirected to `/login`.

1. Go to https://console.firebase.google.com and create a new project (or use an existing one).
2. In the project, go to **Build → Authentication → Get started**, then enable the **Email/Password** sign-in provider.
3. Go to **Project settings → General → Your apps**, click the web icon (`</>`) to register a web app.
4. Copy the `firebaseConfig` object it gives you.
5. Open `src/firebase.js` in this project and paste your values in place of the placeholders:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

6. Restart the dev server. You should now be able to sign up at `/signup` and log in at `/login`.

### What was added
- `src/firebase.js` — Firebase config/init (put your keys here)
- `src/contexts/AuthContext.jsx` — signup/login/logout + current user state
- `src/pages/Login.jsx`, `src/pages/Signup.jsx` — auth pages, styled to match the app
- `src/components/ProtectedRoute.jsx` — redirects signed-out users to `/login`
- Sidebar/Header now show the real logged-in user (name/email/initial) and a logout button
- `src/utils/authErrors.js` — maps Firebase error codes to translated messages (AR/EN)

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/   Reusable UI: Sidebar, Header, TaskCard, TaskFormModal,
                TaskDetailsModal, ConfirmDialog, FilterBar, StatsCard, EmptyState
  pages/        Dashboard, AllTasks (also powers Today/Upcoming/Completed), CalendarPage, Settings
  contexts/     TaskContext (CRUD + localStorage), ThemeContext (MUI theme + dark mode),
                LanguageContext (i18n + RTL), ModalContext (dialog state)
  utils/        constants.js, translations.js, helpers.js
```

## Notes

- Task images are stored as base64 data URLs in localStorage — fine for a demo/local app;
  swap for real file storage/CDN uploads in a production backend.
- Language strings live in `src/utils/translations.js` — add a new locale by adding a key there.
