# 📒 Pocket Notes

A **responsive minimal note-taking app** built with **React + Vite** and **CSS Modules**.  
Organize notes into groups, customize colors, and enjoy a clean UI that works seamlessly across desktop and mobile.

---

## ✨ Features

- 🗂 **Group Management**  
  Create, edit, and delete groups with customizable colors. Avatars auto-generate from group initials.

- 📝 **Notes**  
  Add, edit, and delete notes within groups. Each note includes created/updated timestamps.

- 💾 **Persistence**  
  All data is stored in **localStorage**, so your groups and notes are saved across sessions.

- 📱 **Responsive Design**  
  - Desktop: sidebar with groups + notes pane side-by-side.  
  - Mobile: two-page flow (group list → notes page with back button).  

- 🎨 **Custom UI**  
  - Welcome page with hero illustration.  
  - Bottom-right floating “+” button to add groups.  
  - Three-dots options menu with Edit and Delete actions.  
  - Color picker with active highlight and default selection.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app
```bash
npm run dev
```

The app will start at: [http://localhost:5173](http://localhost:5173)

---


## 🛠 Tech Stack
- [React](https://react.dev/) – UI Library  
- [Vite](https://vitejs.dev/) – Fast dev environment & build tool  
- CSS Modules – Scoped styling with plain CSS  
- LocalStorage – Simple persistence layer  
