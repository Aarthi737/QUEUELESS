# QueueLess — Smart Digital Queue Management

> *"Skip the Line. Save Your Time."*  
> A complete full-stack digital queue management application powered by a React frontend, Node.js + Express backend, and MongoDB database with Mongoose.

---

## 1. Project Overview

**QueueLess** is a digital queue-management platform designed for hospitals, commercial banks, university administration offices, and citizen service centers. It eliminates physical waiting line congestion by allowing visitors to:
- Browse facilities and see real-time queue lengths and wait estimates.
- Issue digital queue tokens remotely with a single tap.
- Track their exact turn, people ahead, and progress in real time.
- Arrive at the assigned counter exactly when their turn is called.

The project features:
- **Customer Experience**: Digital token issuance, real-time progress sequence (`A35 → A36 → ... → A42`), queue cancellation with confirmation modal, and past visit logs.
- **Staff Calling Console**: Live counter view with **CALL NEXT**, **Skip**, **Complete**, **Pause/Resume**, and upcoming token lists.
- **Admin Overview**: System-wide statistics (*Active Queues, People Served, Waiting Counts, Average Wait Time*), user listings, and one-click demo data reset.

---

## 2. Technology Stack

### Frontend:
- **Framework**: React 19 (JavaScript, ES modules)
- **Bundler & Dev Server**: Vite 8
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Design System**: Custom light-theme CSS tokens (`#F8FAFC` background, `#2563EB` primary, `#0EA5E9` secondary, `#16A34A` success, `#F59E0B` warning, `#DC2626` error, `#1E293B` text, `#FFFFFF` cards, `#E2E8F0` borders)

### Backend:
- **Runtime**: Node.js (v20+)
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) & password hashing (`bcryptjs`)
- **Environment**: `dotenv`
- **CORS**: `cors` with multi-origin support

---

## 3. Folder Structure

```text
queueless/
├── API_DOCUMENTATION.md          # Complete REST API reference
├── README.md                     # Comprehensive documentation
├── index.html                    # Root HTML template
├── package.json                  # Root scripts & frontend dependencies
├── vite.config.js                # Vite build configuration
├── .env                          # Frontend environment variables
├── .env.example                  # Frontend env template
│
├── src/                          # Existing Frontend (Preserved)
│   ├── main.jsx
│   ├── App.jsx
│   ├── context/
│   │   └── QueueContext.jsx      # Central state wired to backend REST APIs
│   ├── services/
│   │   └── api.js                # Reusable API client (authAPI, queuesAPI, adminAPI)
│   ├── data/                     # Fallback schemas and seed templates
│   │   ├── services.js
│   │   ├── queues.js
│   │   └── users.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── QueueCard.jsx
│   │   ├── TokenCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterButton.jsx
│   │   ├── StatCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── EmptyState.jsx
│   │   └── LoadingState.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── FindQueuePage.jsx
│   │   ├── JoinQueuePage.jsx
│   │   ├── QueueTrackingPage.jsx
│   │   ├── QueueHistoryPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── AdminDashboard.jsx
│   └── styles/
│       └── main.css
│
└── server/                       # Node.js + Express Backend
    ├── package.json              # Backend dependencies
    ├── server.js                 # Express server & DB initialization
    ├── test_api.js               # Automated 19-test backend API verification
    ├── e2e_simulation.js         # Full end-to-end user flow & persistence test
    ├── .env                      # Backend environment variables
    ├── .env.example              # Backend env template
    ├── config/
    │   ├── db.js                 # MongoDB connection module
    │   ├── seedData.js           # Database seeder module
    │   └── seed.js               # CLI seed script
    ├── controllers/
    │   ├── authController.js     # User registration, login, profile
    │   ├── queueController.js    # Queue calculations, join/leave, calling
    │   ├── adminController.js    # System overview & management
    │   └── userController.js     # User lookups
    ├── middleware/
    │   ├── authMiddleware.js     # JWT protection & role authorization
    │   └── errorMiddleware.js    # Centralized error handling
    ├── models/
    │   ├── User.js               # User Mongoose model
    │   ├── Queue.js              # Service / Queue Mongoose model
    │   └── QueueEntry.js         # Queue Token Entry Mongoose model
    ├── routes/
    │   ├── authRoutes.js
    │   ├── queueRoutes.js
    │   ├── adminRoutes.js
    │   └── userRoutes.js
    └── utils/
        └── generateToken.js      # JWT helper
```

---

## 4. MongoDB Database Schemas

### 1. `User` Schema
* `name`: String (required, trimmed)
* `email`: String (required, unique, lowercase)
* `password`: String (bcrypt hashed, min 6 characters, excluded from JSON)
* `phone`: String
* `preferredLocation`: String
* `role`: Enum `['customer', 'staff', 'admin']` (default: `'customer'`)
* `avatar`: String (initials)
* `assignedServiceId`: ObjectId reference to `Queue` (for staff)
* `timestamps`: `true`

### 2. `Queue` Schema
* `name`: String (e.g., `CityCare Hospital`)
* `department`: String (e.g., `General Consultation`)
* `category`: Enum `['Healthcare', 'Banking', 'College', 'Government', 'Services']`
* `codePrefix`: String (e.g., `A`, `B`, `U`, `G`, `L`, `T`)
* `currentServing`: String (e.g., `A35`)
* `currentNumber`: Number (e.g., `35`)
* `peopleWaiting`: Number (live count of waiting visitors)
* `avgWaitPerPerson`: Number (minutes, default: 3)
* `estimatedWait`: Number (`peopleWaiting * avgWaitPerPerson`)
* `location`: String (e.g., `Main Block, 1st Floor, OPD Room 4`)
* `operatingHours`: String (e.g., `08:00 AM - 05:00 PM`)
* `counterNumber`: String (e.g., `OPD Desk 4`)
* `status`: Enum `['Active', 'Paused', 'Closed']` (default: `'Active'`)
* `description`: String

### 3. `QueueEntry` Schema
* `queueId`: ObjectId reference to `Queue` (indexed)
* `userId`: ObjectId reference to `User` (indexed, optional for walk-ins)
* `customerName`: String
* `customerPhone`: String
* `tokenNumber`: String (e.g., `A42`)
* `tokenIndex`: Number (e.g., `42`)
* `notes`: String
* `status`: Enum `['Waiting', 'Now Serving', 'Completed', 'Cancelled', 'Skipped']`
* `joinedAt`: Date
* `servedAt`: Date
* `completedAt`: Date
* `timestamps`: `true`

---

## 5. Queue Logic & Real-Time Calculations

All values displayed in the frontend originate directly from MongoDB:
1. **Next Token Generation**:
   When joining a queue, the server looks for the highest existing `tokenIndex` in the queue (`max(tokenIndex, currentNumber + peopleWaiting)`), increments it by 1, and prefixes it with the department code (e.g., `A43`).
2. **People Ahead**:
   Computed dynamically from MongoDB using `QueueEntry.countDocuments({ queueId, status: 'Waiting', tokenIndex: { $lt: userTokenIndex } })`.
3. **Estimated Wait Time**:
   Calculated as `peopleAhead * queue.avgWaitPerPerson`.
4. **Staff Advancing (CALL NEXT)**:
   - Marks previous `'Now Serving'` entry as `'Completed'`.
   - Increments `queue.currentNumber` by 1.
   - Updates `queue.currentServing` (e.g., `A36`).
   - Finds matching waiting entry and marks it `'Now Serving'`.
   - Decrements `peopleWaiting` and recalculates `estimatedWait`.
5. **Leaving Queue**:
   Marks the ticket as `'Cancelled'` and moves it to the user's history log.

---

## 6. Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/queueless
JWT_SECRET=queueless_jwt_secure_secret_key_2026_antigravity
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

*(For MongoDB Atlas in production, set `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/queueless?retryWrites=true&w=majority`)*

### Frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. How to Install and Run Locally

### Prerequisites:
- Node.js (v20 or higher)
- Local MongoDB or MongoDB Atlas URI

### Step 1: Install Dependencies
```bash
# In project root:
npm install

# In server directory:
cd server
npm install
cd ..
```

### Step 2: Start Backend Server
```bash
# Option A: From root directory
npm run server

# Option B: From server directory
cd server
npm start
```
*Backend runs on `http://localhost:5000/api` and auto-seeds initial data on first run.*

### Step 3: Start Frontend
```bash
# In another terminal from root directory:
npm run dev
```
*Frontend runs on `http://localhost:5174` (or `http://localhost:5173`).*

---

## 8. Automated Testing

The backend includes a comprehensive automated test suite and an end-to-end integration simulation script:

### Run Backend API Unit / Endpoint Tests (19 Tests):
```bash
npm run server:test
```
Verifies:
- `GET /api/health`
- `POST /api/auth/register` (success and 409 duplicate check)
- `POST /api/auth/login` (success and 401 invalid password)
- `GET /api/auth/me` (Bearer token validation)
- `GET /api/queues` & `GET /api/queues/:id`
- `POST /api/queues/:id/join` & duplicate check
- `DELETE /api/queues/:id/leave`
- `GET /api/queues/my/active` & `GET /api/queues/my/history`
- `POST /api/queues/:id/call-next`
- `PUT /api/queues/:id/toggle-pause`
- `GET /api/admin/overview` & `GET /api/admin/users`

### Run End-to-End User Flow & MongoDB Persistence Test:
```bash
npm run server:e2e
```
Executes a 10-step full customer lifecycle (register → login → view queues → issue token → check position → staff advance → leave queue → verify history persistence → update profile).

---

## 9. Seed & Demo Switcher Accounts

The database comes pre-seeded with 3 realistic accounts for instant evaluation:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `aarthi.sharma@example.com` | `password123` | Holds token `# A42` in CityCare Hospital |
| **Staff** | `r.kumar@citycare.org` | `password123` | Assigned to CityCare Hospital OPD Desk 4 |
| **Admin** | `admin@queueless.io` | `password123` | System Administrator with full overview |

*(You can also use the One-Click Demo Role Switcher in the top bar to toggle between roles instantly).*

To reset the database back to clean initial data at any time:
```bash
npm run seed
```
*(Or click **Reset Demo Data** in the top navigation bar).*

---

## 10. Deployment Instructions

### Backend (Render / Railway):
1. Create a Web Service on Render or Railway connected to your repository.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start` (or `node server.js`)
5. Configure environment variables in the host dashboard:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/queueless?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<secure-random-string>`
   - `CLIENT_URL`: `https://<your-frontend-domain>`

### Database (MongoDB Atlas):
1. Create a free cluster on MongoDB Atlas.
2. Create database user with Read/Write privileges.
3. Whitelist Network Access (`0.0.0.0/0` for cloud deployment).
4. Copy the connection string to `MONGO_URI`.

### Frontend (Vercel / Netlify / GitHub Pages):
1. Connect the frontend root directory.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variable:
   - `VITE_API_URL`: `https://<your-backend-domain>/api`
