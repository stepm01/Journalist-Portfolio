# Redesign — integration guide

This drops into your existing Vite + React + Firebase repo (`anna-s-website`). No new npm
packages are required — animations use CSS + IntersectionObserver, and you already have
`react-router-dom`, `firebase`, and `lucide-react`.

## 1. Copy these files into your repo (overwrite where names match)

```
src/App.jsx                            (replaces routing — single landing page)
src/styles/global.css                  (new design tokens)
src/contexts/DataContext.jsx           (adds experience / reels / bylines)
src/components/AdminLayout.jsx         (new shared admin shell)
src/components/AdminLayout.css         (new)
src/pages/Home.jsx                     (new landing page)
src/pages/Home.css                     (new)
src/pages/admin/AdminDashboard.jsx     (replaces old)
src/pages/admin/AdminDashboard.css     (replaces old)
src/pages/admin/AdminExperience.jsx    (new)
src/pages/admin/AdminReels.jsx         (new)
src/pages/admin/AdminBylines.jsx       (new)
src/pages/admin/AdminSettings.jsx      (replaces old — now the profile editor)
firestore.rules                        (paste into Firebase console)
```

Files NOT touched, keep as-is: `AuthContext.jsx`, `ProtectedRoute.jsx`,
`AdminLogin.jsx`, `config/firebase.js`, `main.jsx`.

Make sure `main.jsx` still imports the stylesheet: `import './styles/global.css'`.

## 2. Files you can now delete (old public pages — dropped per single-page design)

`Portfolio.jsx/.css`, `ProjectDetail.jsx/.css`, `Blog.jsx/.css`, `BlogPost.jsx/.css`,
`AdminBlog.jsx/.css`, `AdminProjects.jsx/.css`, `Navbar.jsx/.css`, `Footer.jsx/.css`
(the new Home has its own nav + footer). `Valentine.jsx` is also no longer routed.
Deleting is optional — nothing imports them anymore.

## 3. Manual steps in Firebase / Google (I can't do these for you)

1. **Firestore → Rules** — paste the contents of `firestore.rules` and Publish.
2. **Authentication** — confirm Email/Password is enabled and your admin user exists
   (Authentication → Users → Add user).
3. **Storage → Rules** — keep your existing `read: if true; write: if request.auth != null;`.
   Image uploads go to `reels/`, `bylines/`, and `profile/`.
4. **Security (do this):** your web API key was committed in a public repo. A Firebase web
   key isn't a secret by design, but turn on **App Check** (Console → App Check) so the DB
   and Storage can't be hammered by anyone who copies the config. Consider rotating the key.

## 4. Seed your content

Everything is edited from the admin panel — no manual DB entry needed:

- `/studio/settings` — name, tagline, bio, about, focus areas, hero publications,
  portrait, email, CV link, social links. (Saves to `settings/profile`.)
- `/studio/experience` — resume timeline (role, org, date, description, order).
- `/studio/reels` — thumbnail, title, description, link, views, order.
- `/studio/bylines` — cover image, title, subtitle, publication, link, order.

`order` is a number; lower shows first. The page renders with graceful placeholders until
you add real content, so nothing looks broken on first load.

## 5. Run

```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

## Notes on the design

- Tagline accent: wrap a word in `*asterisks*` in Settings to make it red (e.g.
  `reports in *motion*.`).
- About field: the first line becomes the large lead statement; each following line
  becomes a body paragraph.
- Reels currently link out (Instagram/TikTok/YouTube). The data model keeps a `link`
  per reel, so switching to inline embeds later is a small change to `Home.jsx`.
