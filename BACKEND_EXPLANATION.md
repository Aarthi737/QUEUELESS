# QueueLess — Backend Project Explanation Guide

> **Purpose of this document:**  
> This guide is prepared specifically for you to easily understand, walk through, and explain the backend and database architecture during your college viva, faculty review, or project evaluation. Everything is explained in straightforward, clear computer science terminology.

---

## 1. Quick Project Overview

**QueueLess** is a full-stack digital queue management web application. Instead of standing in crowded waiting rooms at hospitals, banks, university offices, or government centers, visitors can get a digital token from their phone, track how many people are ahead of them in real-time, and walk to the counter only when their number is called.

* **Frontend:** React 19 + Vite (User Interface, Forms, Real-Time Badges)
* **Backend:** Node.js + Express.js (REST API, Queue Number Generation, Security)
* **Database:** MongoDB + Mongoose ODM (Persistent Users, Queues, and Token Tickets)

---

## 2. File-by-File Breakdown

### `server.js` (The Server Entry Point)
* **What it does:**  
  This is the main brain that starts our Node.js backend.
* **Key responsibilities:**
  1. Loads environment variables from `.env` using `dotenv`.
  2. Enables **CORS** (`cors`) so our React frontend on port `5174` can make API calls to the server on port `5000`.
  3. Uses `express.json()` to parse JSON bodies sent by the frontend.
  4. Connects to the MongoDB database using `connectDB()`.
  5. Auto-seeds default hospital and bank queues if the database is empty.
  6. Mounts our route endpoints:
     * `/api/auth` & `/api/users` ➔ `userRoutes.js`
     * `/api/queues` ➔ `queueRoutes.js`
     * `/api/admin` ➔ `adminRoutes.js`
  7. Attaches error-handling middleware (`notFound` and `errorHandler`).
  8. Starts listening on `http://localhost:5000`.

---

### `db.js` (Database Connection)
* **What it does:**  
  Connects our Express application to MongoDB using **Mongoose**.
* **Key responsibilities:**
  1. Reads `process.env.MONGO_URI`.
  2. Calls `mongoose.connect(mongoURI)`.
  3. Logs connection host name (`127.0.0.1/queueless`) when successful.
  4. If MongoDB is down or the connection string is wrong, it logs a clear error and shuts down safely instead of silently failing.

---

### `models/User.js` (User Data Model)
* **What it stores:**  
  Information about registered people using the app (Customers, Staff, Admins).
* **Fields:**
  * `name`: User's full name (e.g. `"Aarthi Sharma"`).
  * `email`: Unique email address used for login (indexed and lowercased).
  * `password`: The user's password — **hashed using bcrypt** (never plain text!).
  * `phone`: Mobile number for turn notifications.
  * `preferredLocation`: Branch or campus name.
  * `role`: `'customer'`, `'staff'`, or `'admin'`.
  * `avatar`: Initials (e.g. `"AS"`).
* **Security Feature:**  
  Uses a Mongoose `pre('save')` hook to automatically salt and hash passwords, and a `toJSON` transform that strips the `password` field from API responses.

---

### `models/Queue.js` (Queue / Facility Model)
* **What it stores:**  
  Information about a department or service counter that has a waiting line.
* **Fields:**
  * `name`: Facility name (e.g. `"CityCare Hospital"`).
  * `department`: Department name (e.g. `"General Consultation"`).
  * `category`: Sector (`'Healthcare'`, `'Banking'`, `'College'`, `'Government'`, `'Services'`).
  * `codePrefix`: Letter code for tokens (e.g. `'A'` for Hospital, `'B'` for Bank, `'U'` for University).
  * `currentServing`: Token currently at the counter (e.g. `"A35"`).
  * `currentNumber`: Number of the serving token (e.g. `35`).
  * `peopleWaiting`: Count of visitors currently waiting in line.
  * `avgWaitPerPerson`: Estimated minutes per visitor (default: `3` min).
  * `estimatedWait`: Total estimated wait time (`peopleWaiting * avgWaitPerPerson`).
  * `counterNumber`: Desk identifier (e.g. `"OPD Desk 4"`).
  * `status`: `'Active'`, `'Paused'`, or `'Closed'`.

---

### `models/QueueEntry.js` (or `models/Entry.js`) (Token Ticket Model)
* **What it stores:**  
  Each individual token issued to a visitor.
* **Fields:**
  * `queueId`: ObjectId referencing the `Queue` collection.
  * `userId`: ObjectId referencing the `User` collection (who took this ticket).
  * `customerName`: Visitor's name.
  * `customerPhone`: Visitor's phone.
  * `tokenNumber`: Formatted ticket string (e.g. `"A42"`).
  * `tokenIndex`: Integer sequence number (e.g. `42`).
  * `status`: `'Waiting'`, `'Now Serving'`, `'Completed'`, `'Cancelled'`, or `'Skipped'`.
  * `joinedAt`: Timestamp when the user took the token.
  * `servedAt`: Timestamp when staff called the user.
  * `completedAt`: Timestamp when visit finished or was cancelled.

---

### `middleware/auth.js` (Authentication & Security)
* **Why it is needed:**  
  To protect private actions (like viewing your active ticket, viewing your medical queue history, or staff calling next tokens) from unauthorized access.
* **How it works:**
  1. `generateToken(userId)`: Signs a secure **JSON Web Token (JWT)** containing the user's ID that expires in 30 days.
  2. `protect(req, res, next)`: Extracts the `Bearer <token>` from the HTTP `Authorization` header, decodes it using `JWT_SECRET`, finds the user in MongoDB, and attaches them to `req.user`. If token is missing or forged, it returns `401 Unauthorized`.
  3. `authorize('staff', 'admin')`: Checks if `req.user.role` has permission to execute staff actions (calling next token, pausing queue).

---

### `routes/userRoutes.js` (User & Auth Endpoints)
* `POST /api/auth/register`: Creates new user in MongoDB, hashes password, returns JWT token.
* `POST /api/auth/login`: Checks email and password, returns JWT token.
* `GET /api/auth/me`: Returns profile of the logged-in user.
* `PUT /api/auth/profile`: Updates name, phone, or location.
* `GET /api/users`: Returns list of registered users for admin review.

---

### `routes/queueRoutes.js` (Queue Operations)
* `GET /api/queues`: Returns all services with live waiting counts and estimated wait times.
* `GET /api/queues/:id`: Returns details for a specific service.
* `POST /api/queues/:id/join`: User joins queue; generates next sequential token in MongoDB.
* `DELETE /api/queues/:id/leave`: User cancels their ticket; updates status to `'Cancelled'`.
* `GET /api/queues/my/active`: Returns the user's currently active ticket with real-time people ahead.
* `GET /api/queues/my/history`: Returns completed and cancelled past visit logs.
* `POST /api/queues/:id/call-next`: Staff advances counter, marks previous token completed, serves next.
* `POST /api/queues/:id/complete`: Staff completes current token.
* `POST /api/queues/:id/skip`: Staff skips absent visitor.
* `PUT /api/queues/:id/toggle-pause`: Staff pauses or resumes counter.

---

## 3. Complete Data Flow Diagrams

### Flow 1: User Login
```text
[User types email & password and clicks "Sign In"]
                 │
                 ▼
[Frontend: calls authAPI.login() in src/services/api.js]
                 │  POST /api/auth/login
                 ▼
[Express Server: server.js routes request to authController.js]
                 │
                 ▼
[MongoDB Query: User.findOne({ email })]
                 │
                 ▼
[Bcrypt check: user.matchPassword(enteredPassword)]
   ├── If Invalid: returns 401 { success: false, message: "Invalid email or password" }
   └── If Valid:
            │
            ▼
   [generateToken(user._id): signs JWT with secret key]
            │
            ▼
   [Returns 200 { success: true, token, user } (Password stripped)]
            │
            ▼
[Frontend: saves token in localStorage, updates currentUser state, redirects to Dashboard]
```

---

### Flow 2: Joining a Queue (Getting Digital Token)
```text
[User selects "CityCare Hospital" and clicks "Get Digital Token"]
                 │
                 ▼
[Frontend: calls queuesAPI.join(serviceId) in src/services/api.js]
                 │  POST /api/queues/:id/join with Bearer Token
                 ▼
[Express Server: queueController.js processes request]
                 │
                 ▼
[Step 1: Checks if queue exists and is "Active" in MongoDB]
                 │
                 ▼
[Step 2: Checks if user already holds an active token (Prevents duplicate)]
                 │
                 ▼
[Step 3: Calculates next token number in sequence]
   Highest existing index (e.g. 41) + 1 = 42
   Token formatted with prefix: "A" + 42 = "A42"
                 │
                 ▼
[Step 4: Counts people ahead in MongoDB]
   QueueEntry.countDocuments({ queueId, status: "Waiting" }) ➔ 7 people ahead
   Estimated wait: 7 * 3 min = 21 minutes
                 │
                 ▼
[Step 5: Saves new QueueEntry document in MongoDB]
                 │
                 ▼
[Step 6: Increments queue.peopleWaiting in Queue document]
                 │
                 ▼
[Returns 201 { success: true, data: { tokenNumber: "A42", peopleAhead: 7, estimatedWait: 21 } }]
                 │
                 ▼
[Frontend displays prominent ticket #A42 with live progress sequence A35 ➔ ... ➔ A42]
```

---

### Flow 3: Staff Calling Next Token
```text
[Staff clicks "CALL NEXT" button on Counter Console]
                 │
                 ▼
[Frontend: calls queuesAPI.callNext(serviceId)]
                 │  POST /api/queues/:id/call-next
                 ▼
[Express Server: queueController.js]
                 │
                 ▼
[Step 1: Marks previous "Now Serving" ticket (A35) as "Completed"]
                 │
                 ▼
[Step 2: Increments queue.currentNumber from 35 ➔ 36 (Now Serving: "A36")]
                 │
                 ▼
[Step 3: Finds entry with token A36 in MongoDB and updates status to "Now Serving"]
                 │
                 ▼
[Step 4: Decrements peopleWaiting in Queue document]
                 │
                 ▼
[Returns 200 { success: true, currentServing: "A36", peopleWaiting: 11 }]
                 │
                 ▼
[Frontend: Refreshes customer view in real-time]
   - Aarthi's people ahead drops from 7 ➔ 6
   - Estimated wait drops from 21 min ➔ 18 min
   - When A42 is reached: Customer gets green alert "Ding! Your turn has arrived!"
```

---

### Flow 4: Leaving a Queue
```text
[User clicks "Leave Queue" ➔ Confirms in Modal "Yes, Leave Queue"]
                 │
                 ▼
[Frontend: calls queuesAPI.leave(serviceId)]
                 │  DELETE /api/queues/:id/leave
                 ▼
[Express Server: queueController.js]
                 │
                 ▼
[Finds active QueueEntry for user in MongoDB]
                 │
                 ▼
[Updates status from "Waiting" ➔ "Cancelled", records completedAt timestamp]
                 │
                 ▼
[Decrements peopleWaiting on Queue document]
                 │
                 ▼
[Returns 200 { success: true, message: "You have left the queue." }]
                 │
                 ▼
[Frontend: Active ticket resets to null; cancelled visit appears in History tab]
```

---

## 4. Key Questions Faculty Might Ask (With Answers!)

### Q1: Is the data really in MongoDB or just stored in React state?
> **Answer:**  
> "Sir, all persistent data is stored in MongoDB. When a user registers, logs in, joins a queue, or leaves a queue, an HTTP request is sent to our Express backend. The backend executes Mongoose operations on MongoDB collections (`users`, `queues`, and `queueentries`). Even if we refresh the page, close the browser, or open a different tab, the token, position, and history are retrieved from MongoDB."

### Q2: How is the token number calculated? Can two users get the same token?
> **Answer:**  
> "Sir, token generation is handled entirely on the backend in `queueController.js`. When a user requests a token, the server queries the highest `tokenIndex` in that specific queue, increments it by 1, and prefixes the department code (e.g. `'A'` for hospital, `'B'` for bank). We also check if the user already has an active ticket in that queue to prevent duplicate tokens."

### Q3: How do you protect user passwords?
> **Answer:**  
> "Sir, we use **bcryptjs** with a salt round of 10. Passwords are never stored as plain text. When a user registers, Mongoose runs a `pre('save')` hook that hashes the password before writing to MongoDB. When logging in, `bcrypt.compare()` compares the plain password with the hash. Furthermore, our Mongoose model strips the password from all JSON responses."

### Q4: How is user authentication maintained across pages?
> **Answer:**  
> "Sir, we use **JSON Web Tokens (JWT)**. On successful login, the server signs a JWT containing the user's MongoDB `_id` using a secure secret key. The frontend stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header for all protected API requests. The `protect` middleware in `auth.js` verifies the token before allowing access to user-specific routes."

### Q5: Can normal customers call next tokens or pause queues?
> **Answer:**  
> "Sir, no. We implemented role-based authorization in `middleware/auth.js`. Only accounts with `role: 'staff'` or `role: 'admin'` are authorized to call next, skip tokens, or pause service counters."
