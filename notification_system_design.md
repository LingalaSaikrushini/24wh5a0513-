# Stage 1: Notification System REST API Design

## Overview
Campus Notification Platform for Placements, Events, and Results with real-time updates.

## Base URL
\http://4.224.186.213/evaluation-service/notifications\

## Authentication
All endpoints are protected:
\\\http
Authorization: Bearer <your_access_token>
Content-Type: application/json
\\\

---

## Core Endpoints

### 1. Get Notifications (Main API)
**GET** \/notifications\

**Query Parameters:**
- \limit\ (number, default: 10)
- \page\ (number, default: 1)
- \
otification_type\ (string: "Placement" | "Result" | "Event")

**Response (200)**
\\\json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22 17:51:18",
      "isRead": false
    }
  ],
  "pagination": {
    "total": 245,
    "page": 1,
    "limit": 10
  }
}
\\\

### 2. Mark as Read
**PATCH** \/notifications/:id/read\

### 3. Mark All as Read
**PATCH** \/notifications/read-all\

### 4. Priority Notifications
**GET** \/notifications/priority?limit=10\

---

## Real-time Notification Mechanism
**Recommended:** Server-Sent Events (SSE)

**Endpoint:** \GET /notifications/stream\

**Frontend Example:**
\\\js
const eventSource = new EventSource('/notifications/stream');
eventSource.onmessage = (e) => {
  Log("frontend", "info", "middleware", "New notification received");
};
\\\

---

## Logging Integration (Mandatory)
\\\js
Log("backend", "info", "controller", "Fetching notifications");
Log("backend", "error", "repository", "Failed to fetch notifications");
Log("frontend", "info", "style", "UI updated with new notification");
\\\

**Submitted as per guidelines.**
