# Reacher API Documentation

This directory contains HTTP files for testing and documenting the Reacher API endpoints.

## Overview

Reacher is a geography guessing game where users can:
- Create sessions to track their progress
- Receive clues about cities and guess their names
- Earn points for correct guesses
- Create and share invites with friends

## API Structure

The API is organized into the following sections:

### 1. Session API (`session.http`)
- **POST /api/v1/session**: Create a new user session

### 2. City API (`city.http`)
- **GET /api/v1/city/random**: Get a random city clue
- **POST /api/v1/city/guess/verify**: Verify a city guess

### 3. Invite API (`invite.http`)
- **POST /api/v1/invite**: Create a new invite
- **GET /api/v1/invite/:id**: Get invite details by ID

## How to Use These Files

These `.http` files can be used with REST client extensions like:
- [REST Client for VS Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [HTTP Client in JetBrains IDEs](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)

Simply open the file and click "Send Request" next to any of the HTTP requests.

## Environment Variables

You can customize the following variables within each `.http` file:
- `@baseUrl`: The base URL for the API (default: http://localhost:3000/api/v1)
- `@contentType`: The content type for requests (default: application/json)
- `@sessionId`: Your session ID
- `@inviteId`: An invite ID for testing

## Authentication

Many endpoints require a valid session ID to be included in the `session-id` header.
To obtain a session ID, first call the `POST /api/v1/session` endpoint.

## Maintaining Documentation

When making changes to the API:
1. Update the corresponding `.http` file
2. Include detailed documentation for new parameters
3. Update example requests and responses
4. Add any new endpoints with appropriate tags and descriptions
