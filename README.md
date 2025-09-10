# Group Room API

A RESTful API to create and manage group rooms where users can join before the group is full. Each group has a maximum number of participants, expiry time, and unique room code.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Setup & Installation](#setup--installation)  
- [Running the Project](#running-the-project)  
- [API Endpoints](#api-endpoints)  
- [Swagger API Documentation](#swagger-api-documentation)  
- [Assumptions & Limitations](#assumptions--limitations)  
- [Live Demo](#live-demo)  

---

## Project Overview

- Users can create a group with a `maxParticipants` limit and optional `name`.  
- Groups automatically expire after 30 minutes if not filled.  
- Users can join a group using its unique `roomCode`.  
- Group status can be fetched using `roomCode`.  
- Expired or complete groups do not allow additional participants.  

---

## Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/RishiWebforest/Group-Room-API.git
cd group-room-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
GROUP_EXPIRY_MINUTES=30
NODE_ENV=development
```

4. **Run the project**

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## API Endpoints

### 1. Create a Group

- **URL:** `/api/groups`  
- **Method:** `POST`  
- **Body Parameters:**

```json
{
  "maxParticipants": 5,
  "name": "Study Group"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "id": "64f4b2f1234567890abcdef0",
    "roomCode": "A1B2C3",
    "name": "Study Group",
    "maxParticipants": 5,
    "participants": 0,
    "isComplete": false,
    "isExpired": false,
    "createdAt": "2025-09-10T10:00:00.000Z",
    "expiresAt": "2025-09-10T10:30:00.000Z",
    "timeLeftMs": 1800000
  }
}
```

---

### 2. Join a Group

- **URL:** `/api/groups/{roomCode}/join`  
- **Method:** `POST`  
- **Path Parameter:** `roomCode` (string)  
- **Body Parameters:**

```json
{
  "userId": "user123"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Joined group successfully",
  "data": {
    "id": "64f4b2f1234567890abcdef0",
    "roomCode": "A1B2C3",
    "name": "Study Group",
    "maxParticipants": 5,
    "participants": 1,
    "isComplete": false,
    "isExpired": false,
    "createdAt": "2025-09-10T10:00:00.000Z",
    "expiresAt": "2025-09-10T10:30:00.000Z",
    "timeLeftMs": 1790000
  }
}
```

> If the group is full, the message will be `"Group is now full"`.

---

### 3. Get Group Status

- **URL:** `/api/groups/{roomCode}`  
- **Method:** `GET`  
- **Path Parameter:** `roomCode` (string)  

- **Response:**

```json
{
  "success": true,
  "message": "Group status fetched successfully",
  "data": {
    "id": "64f4b2f1234567890abcdef0",
    "roomCode": "A1B2C3",
    "name": "Study Group",
    "maxParticipants": 5,
    "participants": 1,
    "isComplete": false,
    "isExpired": false,
    "createdAt": "2025-09-10T10:00:00.000Z",
    "expiresAt": "2025-09-10T10:30:00.000Z",
    "timeLeftMs": 1790000
  }
}
```

---

## Swagger API Documentation

This project includes Swagger UI for easy exploration of the API.

- After running the project, visit:  
  👉 [http://localhost:5000/api/docs/](http://localhost:5000/api/docs/)

---

## Assumptions & Limitations

- `roomCode` is a unique 6-character alphanumeric string used as the primary identifier for joining a group.  
- Optional `name` field can help identify the group but is not unique.  
- Group expires automatically after `GROUP_EXPIRY_MINUTES` (default 30 minutes).  
- Rate limiting is applied: 20 requests per minute per IP for group endpoints.  
- No authentication implemented; all endpoints are public.  
- `participants` is an array of string `userId`s (placeholder, can integrate real user accounts).  

---

## Live Demo

- **Deployed Link:** [https://group-room-api-qgs3.onrender.com](https://group-room-api-qgs3.onrender.com)
