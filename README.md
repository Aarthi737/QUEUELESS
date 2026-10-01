# QueueLess — Smart Digital Queue Management

> "Skip the Line. Save Your Time."
> A modern, friendly, and professional light-themed frontend application for digital queue management.

---

## 🚀 Overview

**QueueLess** allows visitors at hospitals, banks, university registrar offices, and public service centers to join queues digitally, receive digital tokens, track their position in real-time, and arrive right when their turn is called.

This repository is **100% FRONTEND ONLY**:
- Built with **React 19**, **Vite 8**, **JavaScript**, **HTML5**, and modern **CSS**.
- Icons powered by **Lucide React**.
- Fast client-side routing via **React Router DOM v7**.
- **Zero backend, zero database, zero external APIs**.
- High-fidelity **mock data** and reactive **React Context** state with LocalStorage synchronization.

---

## 🎨 Design System & Color Palette

Clean, modern, professional light-theme interface:

| Token | Color Hex | Usage |
| :--- | :--- | :--- |
| **Background** | `#F8FAFC` | App canvas background |
| **Primary** | `#2563EB` | Actions, hero elements, active states |
| **Secondary** | `#0EA5E9` | Highlights and accents |
| **Success** | `#16A34A` | Completed tokens, now serving alerts |
| **Warning** | `#F59E0B` | Waiting badges, queues ahead |
| **Error** | `#DC2626` | Cancelled badges, leave queue |
| **Text Main** | `#1E293B` | High contrast readable typography |
| **Text Secondary**| `#64748B` | Labels, subtitles, hints |
| **Cards** | `#FFFFFF` | Clean rounded surface cards |
| **Borders** | `#E2E8F0` | Subtle, clean card & divider borders |

---

## 📁 Project Structure

```text
queueless/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── context/
    │   └── QueueContext.jsx         # Shared queue state, token calling & local persistence
    ├── data/
    │   ├── services.js              # 6 realistic services across 5 categories
    │   ├── queues.js                # Initial active token (A42), history & token generator
    │   └── users.js                 # Customer, Staff, and Admin mock profiles
    ├── components/
    │   ├── Navbar.jsx               # Navigation bar with role switcher & mobile drawer
    │   ├── Footer.jsx               # Clean footer with category links
    │   ├── Button.jsx               # Reusable button with variants & loading state
    │   ├── ServiceCard.jsx          # Service presentation card
    │   ├── QueueCard.jsx            # Current queue overview card
    │   ├── TokenCard.jsx            # Prominent token card with progress bar
    │   ├── StatusBadge.jsx          # Badges for Waiting, Serving, Completed, etc.
    │   ├── SearchBar.jsx            # Live service search with clear trigger
    │   ├── FilterButton.jsx         # Category pills with count badges
    │   ├── StatCard.jsx             # Admin metrics card
    │   ├── Modal.jsx                # Confirmation & edit profile modal dialog
    │   ├── Toast.jsx                # Non-intrusive floating toast notifications
    │   ├── EmptyState.jsx           # Clean zero-data placeholder
    │   └── LoadingState.jsx         # Loading spinner with message
    ├── pages/
    │   ├── LandingPage.jsx          # Hero, live flow diagram & "How It Works"
    │   ├── UserDashboard.jsx        # Customer dashboard with current token & quick actions
    │   ├── FindQueuePage.jsx        # Search and category filtered service catalog
    │   ├── JoinQueuePage.jsx        # Service details, user form, and token confirmation
    │   ├── QueueTrackingPage.jsx    # Prominent #A42 tracking, sequence, and simulation
    │   ├── QueueHistoryPage.jsx     # Log of completed and cancelled visits with filters
    │   ├── ProfilePage.jsx          # Customer profile & modal editor
    │   ├── LoginPage.jsx            # Sign in with 1-click role logins
    │   ├── RegisterPage.jsx         # User registration form
    │   ├── StaffDashboard.jsx       # Staff calling console with "CALL NEXT"
    │   └── AdminDashboard.jsx       # Essential administrative overview statistics
    └── styles/
        └── main.css                 # Custom CSS design system, typography & layouts
```

---

## 🛠️ Modules Implemented

1. **Module 1 — Landing Page (`/`)**:
   - Hero: *"Skip the Line. Save Your Time."*
   - Visual representation: `Current Token (A35) → Your Token (A42) → People Ahead (7) → Estimated Wait (21 min)`
   - How QueueLess Works: 4 clear steps (Choose a Service, Get Token, Track, Arrive).
2. **Module 2 — User Dashboard (`/dashboard`)**:
   - Prominent **Current Queue Card** displaying Token `A42`, Status `Waiting`, 7 People Ahead, 21 min wait, Current Serving `A35`, and *"View Queue"* button.
   - Quick Action cards: Join a Queue, My Current Queue, Queue History.
3. **Module 3 — Find a Queue (`/queues`)**:
   - Search bar: *"Search hospitals, banks or services..."*
   - Category filters: *All, Healthcare, Banking, College, Government, Services*.
   - 6 realistic cards (CityCare Hospital, City Bank, Metro University, Civic Service Center, Apex Diagnostics, Telecom Express).
4. **Module 4 — Join Queue (`/queue/:id`)**:
   - Service details, wait time, counter, and *"Get Digital Token"* button.
   - Confirmation screen: *"You're in the queue!"* with prominent token `# A42`.
5. **Module 5 — Queue Tracking (`/my-queue`)**:
   - High-impact Token Card: `# A42` in large bold typography.
   - Status badge, Current Serving `A35`, 7 people ahead, 21 min wait.
   - Simple progress indicator: `A35 → A36 → A37 → ... → A42`.
   - *"Leave Queue"* button with confirmation modal.
   - Built-in queue simulator button to watch the queue advance in real time!
6. **Module 6 — Queue History (`/history`)**:
   - Historical logs (CityCare Hospital `A31`, City Bank `B18`, etc.)
   - Filter tabs: *All, Completed, Cancelled*.
7. **Module 7 — Profile (`/profile`)**:
   - Name, Email, Phone, Preferred Location.
   - Working *"Edit Profile"* modal and *"Logout"* action.
8. **Simple Staff Dashboard (`/staff`)**:
   - Current Token `# A35`, People Waiting: `12`, Average Service Time: `3 min`.
   - Main action: **CALL NEXT** (advances token, marks previous completed, updates user tracking view live).
   - Secondary actions: **Skip**, **Complete**, **Pause/Resume Queue**.
   - Upcoming queue list: `A36 — Now Serving`, `A37 — Waiting`, `A38 — Waiting`, etc.
9. **Simple Admin Dashboard (`/admin`)**:
   - Essential statistics: *Active Queues (8), People Served (124), People Waiting (37), Average Wait Time (18 min)*.
   - Active Services table with live token numbers, waiting counts, and pause/manage controls.
10. **Demo Bar & Multi-Role Switching**:
    - Top bar toggle allows instant 1-click switching between Customer (`Aarthi`), Staff (`Dr. Rajesh`), and Admin (`Vikram`), plus a *"Reset Demo Data"* button.

---

## 💻 Running the Application

In the project directory:

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:5174/` in any modern web browser.
