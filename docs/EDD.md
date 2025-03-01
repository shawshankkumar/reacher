# Reacher - Engineering Design Document (Backend)

## 1. Database Schema

### 1.1 City
```prisma
model City {
  id        String   @id @db.VarChar(31)
  city      String
  country   String
  clues     Json
  fun_fact  Json
  trivia    Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([city, country])
  @@index([country])
}
```

### 1.2 Session
```prisma
model Session {
  id         String    @id @db.VarChar(31) // ULID with prefix sess_
  points     Int       @default(10)
  is_active  Boolean   @default(true)
  username   String?
  image_link String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  invites    Invite[]
}
```

### 1.3 User
```prisma
model User {
  id        String   @id @db.VarChar(31)
  username  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 1.4 Invite
```prisma
model Invite {
  id         String   @id @db.VarChar(31) // ULID with prefix invi_
  session_id String   @db.VarChar(31)
  session    Session  @relation(fields: [session_id], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 2. API Endpoints

### 2.1 Create Session
- **Endpoint**: `POST /api/session`
- **Description**: Creates a new session with initial points and returns the session ID
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "session_id": "sess_01HNCJVB2QVTMZQ3MJGYRXVT8T",
    "points": 10
  }
}
```

### 2.2 Get Random Clue
- **Endpoint**: `GET /api/clue/random`
- **Description**: Returns a random clue from any city along with multiple city options
- **Request Body**: None
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "clue": "This city is known for its iconic Opera House",
    "city_id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8T",
    "options": [
      {
        "id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8T",
        "city": "Sydney",
        "country": "Australia"
      },
      {
        "id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8U",
        "city": "Paris",
        "country": "France"
      },
      {
        "id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8V",
        "city": "Rome",
        "country": "Italy"
      },
      {
        "id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8W",
        "city": "Tokyo",
        "country": "Japan"
      }
    ]
  }
}
```

### 2.3 Verify Guess
- **Endpoint**: `POST /api/guess`
- **Description**: Validates a user's guess and awards or deducts points
- **Request Body**:
```json
{
  "session_id": "sess_01HNCJVB2QVTMZQ3MJGYRXVT8T",
  "city_id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8T",
  "guess_id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8U"
}
```
- **Response Body (Correct Guess)**:
```json
{
  "success": true,
  "data": {
    "correct": true,
    "points_gained": 2,
    "total_points": 12,
    "city": {
      "name": "Paris",
      "country": "France"
    },
    "fun_fact": "Paris is known as the 'City of Light'",
    "trivia": "The Eiffel Tower was initially criticized by many of Paris's leading artists and intellectuals"
  }
}
```
- **Response Body (Incorrect Guess)**:
```json
{
  "success": true,
  "data": {
    "correct": false,
    "points_lost": 1,
    "total_points": 9,
    "city": {
      "name": "Paris",
      "country": "France"
    },
    "fun_fact": "Paris is known as the 'City of Light'",
    "trivia": "The Eiffel Tower was initially criticized by many of Paris's leading artists and intellectuals"
  }
}
```

### 2.4 Create User and Generate Invite
- **Endpoint**: `POST /api/invite`
- **Description**: Creates a user, updates the session with user details, and generates an invite link
- **Request Body**:
```json
{
  "session_id": "sess_01HNCJVB2QVTMZQ3MJGYRXVT8T",
  "username": "traveler123"
}
```
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "username": "traveler123",
    "points": 12,
    "image_link": "https://gravatar.com/avatar/a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p",
    "invite_id": "invi_01HNCJVB2QVTMZQ3MJGYRXVT8X",
    "invite_link": "https://reacher.app/invite/invi_01HNCJVB2QVTMZQ3MJGYRXVT8X"
  }
}
```

### 2.5 Get Invite Information
- **Endpoint**: `GET /api/invite/:invite_id`
- **Description**: Returns information about the user who generated the invite
- **Request Parameters**: `invite_id` in URL
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "username": "traveler123",
    "points": 12,
    "image_link": "https://gravatar.com/avatar/a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p"
  }
}
```

## 3. Implementation Details

### 3.1 Session Management
- Session IDs will be generated as ULIDs with prefix `sess_`
- Sessions start with 10 points by default
- Points system:
  - +2 points for correct guesses
  - -1 point for incorrect guesses

### 3.2 Clue Generation and City Selection
- Random clue selection algorithm will pick from the entire City table
- Option generation will include the correct city and 3 random cities
- Ensure cities in options are distinct to avoid duplicates

### 3.3 User Creation and Invite System
- Username must be unique across the platform
- Gravatar image will be generated using session ID hash
- Invite IDs will be generated as ULIDs with prefix `invi_`
- Invite links will follow the format: `https://reacher.app/invite/:invite_id`

### 3.4 Error Handling
- All endpoints will return appropriate HTTP status codes
- Error responses will follow the format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### 3.5 Security Considerations
- Implement rate limiting on all endpoints
- Validate all input data for type, format, and range
- Use parameterized queries to prevent SQL injection
- Implement CORS with appropriate allowed origins

## 4. Data Flow

### 4.1 Game Session Flow
1. User starts game → Session created
2. User receives random clue → Makes guess
3. System validates guess → Updates points
4. User shares progress → Invite created
5. New user joins via invite → New session created

### 4.2 Points System Flow
1. New session starts with 10 points
2. Correct guess adds 2 points
3. Incorrect guess deducts 1 point
4. Points are persisted with the session
5. Points are displayed on the invite link

## 5. Technical Dependencies

- Express.js for API server
- Prisma for database ORM
- PostgreSQL (Neon) for data storage
- ULID library for ID generation
- Crypto for secure hash generation (Gravatar)
- Cors middleware for CORS handling
- Express-rate-limit for rate limiting