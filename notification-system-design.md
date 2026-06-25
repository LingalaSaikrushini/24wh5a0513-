# Notification System Design
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


# Stage 2: Database Design & Schema

## Chosen Database: **PostgreSQL**

**Reason:**
- Excellent support for complex queries and JSONB
- Strong indexing and performance for high volume data (50k+ students, 5M+ notifications)
- Better concurrency and reliability than MySQL for this use case

## Database Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studentID VARCHAR(20) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Event', 'Result', 'Placement')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE,
    metadata JSONB,                    -- For extra data (company, marks, etc.)
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Essential Indexes for Performance
CREATE INDEX idx_notifications_student ON notifications(studentID);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_isread ON notifications(isRead);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp DESC);

-- Composite Index for Main Query
CREATE INDEX idx_student_unread_time ON notifications(studentID, isRead, timestamp DESC);

## Stage 3: Query Optimization

### Original Slow Query
```sql
SELECT * FROM notifications 
WHERE studentID = 1042 AND isRead = false 
ORDER BY createdAt ASC;
