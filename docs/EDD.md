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
  username   String?   @unique
  image_link String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  invites    Invite[]
}
```

### 1.3 Invite
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
- **Endpoint**: `POST /api/v1/session/`
- **Description**: Creates a new session with initial points and returns the session ID
- **Database Operations**: 
  - Creates a new record in the `Session` table with a unique ULID with prefix `sess_`
  - Sets initial points to 10
  - Sets is_active to true
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
- **Endpoint**: `GET /api/v1/city/random`
- **Description**: Returns a random clue from any city along with multiple city options
- **Headers**: 
  - `session-id`: The session ID to validate user's session
- **Database Operations**:
  - Validates the session ID exists and is active in the `Session` table
  - Retrieves a random clue from a random city in the `City` table
  - Fetches 4 random cities (including the correct one) for options
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
        "city": "Sydney",
        "country": "Australia"
      },
      {
        "city": "Paris",
        "country": "France"
      },
      {
        "city": "Rome",
        "country": "Italy"
      },
      {
        "city": "Tokyo",
        "country": "Japan"
      }
    ]
  }
}
```

### 2.3 Verify Guess
- **Endpoint**: `POST /api/v1/city/guess/verify`
- **Description**: Validates a user's guess and awards or deducts points
- **Headers**: 
  - `session-id`: The session ID to validate user's session
- **Database Operations**:
  - Validates the session ID exists and is active in the `Session` table
  - Checks if the guessed city name matches the actual city for the given city_id
  - Updates the session's points (+2 for correct guess, -1 for incorrect guess)
- **Request Body**:
```json
{
  "city_id": "city_01HNCJVB2QVTMZQ3MJGYRXVT8T",
  "guess_city": "Paris"
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
- **Endpoint**: `POST /api/v1/invite/`
- **Description**: Updates the session with user details and generates an invite link
- **Database Operations**: 
  - Validates the session ID exists and is active in the `Session` table
  - Updates the session with the provided username (ensures uniqueness)
  - Creates a gravatar image link using the session ID hash
  - Creates a new record in the `Invite` table with a ULID with prefix `invi_`
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
- **Endpoint**: `GET /api/v1/invite/:id`
- **Description**: Returns information about the user who generated the invite
- **Database Operations**: 
  - Retrieves the invite record from the `Invite` table using the invite ID
  - Joins with the `Session` table to get the user's information
- **Request Parameters**: `id` in URL
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
- Username in session is unique across the platform

### 3.2 Clue Generation and City Selection
- Random clue selection algorithm will pick from the entire City table
- Option generation will include the correct city and 3 random cities
- Ensure cities in options are distinct to avoid duplicates

### 3.3 User and Invite System
- Username must be unique across all sessions
- Gravatar image will be generated using session ID hash
- Invite IDs will be generated as ULIDs with prefix `invi_`
- Invite links will follow the format: `https://reacher.app/invite/:invite_id`

### 3.4 Validation and Error Handling
- Zod will be used for validating all API requests
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
- Zod for API request validation