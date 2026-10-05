# QueueLess REST API Documentation

This document describes all REST API endpoints available in the **QueueLess** backend.

Base URL: `http://localhost:5000/api` (or `https://<your-backend-domain>/api`)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
* **Method:** `POST`
* **Endpoint:** `/api/auth/register`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "name": "Priya Sundaram",
    "email": "priya@example.com",
    "password": "password123",
    "phone": "+91 91234 56789",
    "preferredLocation": "North Campus",
    "role": "customer"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Account registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "6701234...",
      "name": "Priya Sundaram",
      "email": "priya@example.com",
      "phone": "+91 91234 56789",
      "preferredLocation": "North Campus",
      "role": "customer",
      "avatar": "PS"
    }
  }
  ```
* **Possible Errors:**
  * `400 Bad Request`: Missing name, email, or password (< 6 characters).
  * `409 Conflict`: Email already exists.

---

### 1.2 User Login
* **Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "aarthi.sharma@example.com",
    "password": "password123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "6701234...",
      "name": "Aarthi Sharma",
      "email": "aarthi.sharma@example.com",
      "role": "customer",
      "avatar": "AS"
    }
  }
  ```
* **Possible Errors:**
  * `400 Bad Request`: Email or password omitted.
  * `401 Unauthorized`: Invalid email or password.

---

### 1.3 Get Current User Profile
* **Method:** `GET`
* **Endpoint:** `/api/auth/me`
* **Auth Required:** Yes (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "6701234...",
      "name": "Aarthi Sharma",
      "email": "aarthi.sharma@example.com",
      "phone": "+91 98765 43210",
      "preferredLocation": "Central City, Metro Region",
      "role": "customer",
      "avatar": "AS"
    }
  }
  ```
* **Possible Errors:**
  * `401 Unauthorized`: Missing or invalid Bearer token.

---

### 1.4 Update Profile
* **Method:** `PUT`
* **Endpoint:** `/api/auth/profile`
* **Auth Required:** Yes (`Bearer <token>`)
* **Request Body:**
  ```json
  {
    "name": "Aarthi Sharma",
    "phone": "+91 98765 00000",
    "preferredLocation": "East Campus"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": { ... }
  }
  ```

---

## 2. Queue & Service Endpoints (`/api/queues`)

### 2.1 Get All Queues / Services
* **Method:** `GET`
* **Endpoint:** `/api/queues`
* **Query Parameters (optional):**
  * `category`: Filter by category (e.g. `Healthcare`, `Banking`, `College`, `Government`, `Services`)
  * `search`: Search query string
* **Auth Required:** No
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 6,
    "data": [
      {
        "id": "6701234...",
        "name": "CityCare Hospital",
        "department": "General Consultation",
        "category": "Healthcare",
        "codePrefix": "A",
        "currentServing": "A35",
        "currentNumber": 35,
        "peopleWaiting": 12,
        "avgWaitPerPerson": 3,
        "estimatedWait": 36,
        "location": "Main Block, 1st Floor, OPD Room 4",
        "operatingHours": "08:00 AM - 05:00 PM",
        "counterNumber": "OPD Desk 4",
        "status": "Active"
      }
    ]
  }
  ```

---

### 2.2 Get Queue by ID
* **Method:** `GET`
* **Endpoint:** `/api/queues/:id`
* **Auth Required:** No
* **Success Response (200 OK):** Returns single queue details.
* **Possible Errors:**
  * `404 Not Found`: Queue ID does not exist.

---

### 2.3 Join Queue (Get Digital Token)
* **Method:** `POST`
* **Endpoint:** `/api/queues/:id/join`
* **Auth Required:** Optional (Attaches logged-in user if token provided)
* **Request Body:**
  ```json
  {
    "customerName": "Aarthi Sharma",
    "customerPhone": "+91 98765 43210",
    "notes": "Consultation checkup"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Successfully joined the queue! Token: A43",
    "data": {
      "id": "670123...",
      "tokenNumber": "A43",
      "tokenIndex": 43,
      "serviceId": "670123...",
      "serviceName": "CityCare Hospital",
      "department": "General Consultation",
      "category": "Healthcare",
      "location": "Main Block, 1st Floor, OPD Room 4",
      "counterNumber": "OPD Desk 4",
      "status": "Waiting",
      "peopleAhead": 7,
      "estimatedWait": 21,
      "currentServing": "A35",
      "notes": "Consultation checkup"
    }
  }
  ```
* **Possible Errors:**
  * `400 Bad Request`: Queue is Paused or Closed.
  * `404 Not Found`: Queue does not exist.
  * `409 Conflict`: User already holds an active token in this queue.

---

### 2.4 Leave Queue / Cancel Token
* **Method:** `DELETE`
* **Endpoint:** `/api/queues/:id/leave`
* **Auth Required:** Optional (or provides `entryId` / `tokenNumber` in body)
* **Request Body (optional if logged in):**
  ```json
  {
    "entryId": "670123..."
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "You have left the queue."
  }
  ```

---

### 2.5 Get User's Active Queue
* **Method:** `GET`
* **Endpoint:** `/api/queues/my/active`
* **Auth Required:** Yes (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "670123...",
      "tokenNumber": "A42",
      "tokenIndex": 42,
      "serviceId": "67012...",
      "serviceName": "CityCare Hospital",
      "department": "General Consultation",
      "status": "Waiting",
      "peopleAhead": 6,
      "estimatedWait": 18,
      "currentServing": "A36"
    }
  }
  ```
  *(Returns `data: null` if user is not in any active queue)*

---

### 2.6 Get User's Queue History
* **Method:** `GET`
* **Endpoint:** `/api/queues/my/history`
* **Auth Required:** Yes (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      {
        "id": "6701...",
        "tokenNumber": "A31",
        "serviceName": "CityCare Hospital",
        "department": "General Consultation",
        "status": "Completed",
        "date": "Oct 5, 09:30 AM",
        "counter": "OPD Desk 4"
      }
    ]
  }
  ```

---

## 3. Staff & Counter Calling Console (`/api/queues/:id`)

### 3.1 Call Next Token
* **Method:** `POST`
* **Endpoint:** `/api/queues/:id/call-next`
* **Auth Required:** Optional / Staff (`Bearer <token>`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Now serving: A36",
    "data": {
      "currentServing": "A36",
      "currentNumber": 36,
      "peopleWaiting": 11,
      "estimatedWait": 33
    }
  }
  ```

---

### 3.2 Complete Current Token
* **Method:** `POST`
* **Endpoint:** `/api/queues/:id/complete`
* **Auth Required:** Optional / Staff
* **Success Response (200 OK):** Marks current serving token completed and calls the next token.

---

### 3.3 Skip Current Token
* **Method:** `POST`
* **Endpoint:** `/api/queues/:id/skip`
* **Auth Required:** Optional / Staff
* **Success Response (200 OK):** Marks current token skipped and advances to next.

---

### 3.4 Toggle Pause Queue
* **Method:** `PUT`
* **Endpoint:** `/api/queues/:id/toggle-pause`
* **Auth Required:** Optional / Staff
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Queue status changed to Paused",
    "data": { ... }
  }
  ```

---

### 3.5 Get Upcoming Entries List
* **Method:** `GET`
* **Endpoint:** `/api/queues/:id/entries`
* **Auth Required:** No
* **Success Response (200 OK):** Returns upcoming list of tokens with their status.

---

## 4. Admin Management (`/api/admin`)

### 4.1 Today's Overview Statistics
* **Method:** `GET`
* **Endpoint:** `/api/admin/overview`
* **Auth Required:** No
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "activeQueues": 6,
      "totalQueues": 6,
      "peopleServed": 128,
      "peopleWaiting": 49,
      "averageWaitTime": 25,
      "totalUsers": 4
    }
  }
  ```

---

### 4.2 List Registered Users
* **Method:** `GET`
* **Endpoint:** `/api/admin/users`
* **Auth Required:** No
* **Success Response (200 OK):** Returns list of all registered users excluding passwords.

---

### 4.3 Reset Demo Database
* **Method:** `POST`
* **Endpoint:** `/api/admin/reset-demo`
* **Auth Required:** No
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Demo database successfully reset to clean initial state."
  }
  ```
