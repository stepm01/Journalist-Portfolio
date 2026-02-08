# Journalist Portfolio Website

A modern, colorful portfolio website for journalists with a Firebase-powered CMS. Features a beautiful public-facing website and a comprehensive admin panel for content management.

## 🎨 Design Features

- **Modern Colorful Design** (not dark!)
  - Coral/Peach primary colors (#FF6B6B)
  - Teal/Mint accents (#4ECDC4)
  - Purple highlights (#9B5DE5)
  - Mesh gradient backgrounds
  - Smooth animations and transitions

- **Typography**
  - Display: DM Serif Display
  - Body: Plus Jakarta Sans

## 📁 Project Structure

```
journalist-portfolio/
├── public/
│   └── assets/
│       ├── cv/          # Resume/CV files
│       └── images/      # Profile images
├── src/
│   ├── components/
│   │   ├── Navbar.jsx + Navbar.css
│   │   ├── Footer.jsx + Footer.css
│   │   └── ProtectedRoute.jsx
│   ├── config/
│   │   └── firebase.js      # Firebase configuration
│   ├── contexts/
│   │   ├── AuthContext.jsx  # Authentication
│   │   └── DataContext.jsx  # Firestore operations
│   ├── pages/
│   │   ├── Home.jsx + Home.css
│   │   ├── Portfolio.jsx + Portfolio.css
│   │   ├── ProjectDetail.jsx + ProjectDetail.css
│   │   ├── Blog.jsx + Blog.css
│   │   ├── BlogPost.jsx + BlogPost.css
│   │   └── admin/
│   │       ├── AdminLogin.jsx + AdminLogin.css
│   │       ├── AdminDashboard.jsx + AdminDashboard.css
│   │       ├── AdminBlog.jsx + AdminBlog.css (LARGER EDITOR!)
│   │       ├── AdminProjects.jsx + AdminProjects.css
│   │       └── AdminSettings.jsx + AdminSettings.css
│   ├── styles/
│   │   └── global.css       # Design system
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd journalist-portfolio
npm install
```

### 2. Firebase Setup

Your existing Firebase config is preserved in `/src/config/firebase.js`. 

**Important:** Since the repo was public, check these Firebase Console settings:

1. **Authentication** → Sign-in methods → Enable Email/Password
2. **Firestore** → Rules → Update security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public read access
       match /{document=**} {
         allow read: if true;
       }
       // Authenticated write access
       match /blogs/{blogId} {
         allow write: if request.auth != null;
       }
       match /projects/{projectId} {
         allow write: if request.auth != null;
       }
       match /profile/{profileId} {
         allow write: if request.auth != null;
       }
       match /categories/{categoryId} {
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Storage** → Rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

4. **Consider regenerating your API key** if the old one was exposed

### 3. Create Admin User

In Firebase Console → Authentication → Users → Add user

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔐 Admin Panel Access

- **Login URL:** `/studio-access`
- **Dashboard:** `/studio`
- **Blog Editor:** `/studio/blog` (with LARGER, more comfortable editor!)
- **Projects:** `/studio/projects`
- **Settings:** `/studio/settings`

### Admin Features

- ✨ Modern colorful design
- 📝 **Large, comfortable text editor** (450px min-height)
- 🖼️ Image uploads to Firebase Storage
- 📂 Category management
- ⭐ Featured posts/projects
- 🔍 Search and filter
- 📱 Responsive design

## 📄 Pages

### Public

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, about, featured work |
| `/portfolio` | All projects with category filters |
| `/portfolio/:id` | Individual project details |
| `/blog` | All blog posts with search/filters |
| `/blog/:id` | Individual blog post |

### Admin (Protected)

| Route | Description |
|-------|-------------|
| `/studio-access` | Login page |
| `/studio` | Dashboard overview |
| `/studio/blog` | Blog post management |
| `/studio/projects` | Project management |
| `/studio/settings` | Profile & security settings |

## 🛠️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

The `vercel.json` is already configured for SPA routing.

### Manual Deployment

Upload the `dist/` folder to any static hosting (Netlify, GitHub Pages, etc.)

## 🎯 Key Improvements

1. **Modern Colorful Design** - Bright, professional look with coral/teal/purple palette
2. **Larger Editor** - 450px minimum height for comfortable writing
3. **Better UX** - Smooth animations, clear navigation, responsive
4. **Improved Admin Panel** - Dashboard with stats, quick actions
5. **Working Firebase** - Existing config preserved, just needs rule updates

## 📧 Support

If you have issues with Firebase:
1. Check Console → Authentication is enabled
2. Check Firestore/Storage rules
3. Verify domain is authorized in Firebase Console

---

Built with ❤️ using React, Vite, and Firebase
