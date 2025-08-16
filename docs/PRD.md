# Reacher - Product Requirements Document

## 1. Introduction

### 1.1 Purpose
Reacher (code-named "Globetrotter") is a full-stack web application that challenges users to identify famous destinations based on cryptic clues. Upon guessing correctly, users unlock fun facts and trivia about the destination, creating an engaging and educational gaming experience.

### 1.2 Project Goals
- Create an entertaining and educational platform about global destinations
- Implement an engaging user experience with immediate feedback
- Build a social component that allows users to challenge friends
- Develop a scalable backend architecture that can support future feature expansion

## 2. Core Features

### 2.1 Destination Guessing Game

#### 2.1.1 Clue Presentation
- System will present 1-2 random clues from a selected destination
- Clues should be cryptic but solvable with general knowledge
- All destination data must be stored on and retrieved from the backend to prevent client-side access to answers

#### 2.1.2 Answer Selection
- Users will select from multiple possible destination answers
- The UI should present 3-5 options in an intuitive interface
- Options should include the correct answer and plausible alternatives

#### 2.1.3 Feedback System
- Provide immediate visual feedback after answering:
  - Correct Answer: Animate confetti and reveal a fun fact about the destination
  - Incorrect Answer: Show a sad-face animation and reveal a consolation fun fact
- Feedback should be engaging and contribute to the user's knowledge

#### 2.1.4 Game Flow
- Include a 'Play Again' or 'Next' button to load a different random destination
- Ensure that destinations don't repeat until all have been shown at least once
- Track and display the user's total score (correct vs. incorrect answers)
- Implement a session-based scoring system that persists until the user closes the browser

### 2.2 Challenge a Friend Feature

#### 2.2.1 User Registration
- User enters a unique username before inviting friends
- Username must be validated for uniqueness in the system
- Simple profile creation with minimal friction (no password required)

#### 2.2.2 Challenge Generation
- 'Challenge a Friend' button generates a unique invitation link
- System creates a dynamic image with the game branding and user's score
- Provide sharing options focused on WhatsApp integration

#### 2.2.3 Invitation Experience
- Invited users can see the inviter's username and score before playing
- The invitation link grants full access to the game features
- Track and compare scores between the inviter and invitee

## 3. Technical Requirements

### 3.1 Frontend
- Implement using Remix.js and TypeScript
- Create responsive design that works across desktop and mobile devices
- Optimize for performance and loading speed
- Deploy on Vercel

### 3.2 Backend
- Develop using Express.js and TypeScript
- Implement RESTful API endpoints for game data and user information
- Secure the system against common vulnerabilities
- Deploy on Fly.io

### 3.3 Database
- Utilize Neon database for data storage
- Design schemas for destinations, clues, facts, and user profiles
- Implement efficient query patterns for game operations

### 3.4 Integration & Deployment
- Set up CI/CD pipelines for automated testing and deployment
- Implement logging and monitoring for system health
- Create documentation for API endpoints and system architecture

## 4. Evaluation Criteria

### 4.1 Extensibility
- Architecture should support adding new destinations easily
- Code structure should allow for future feature expansion
- Database schema should be flexible for additional data points

### 4.2 UI/UX Quality
- Interface should be intuitive and engaging
- Animations and transitions should enhance the user experience
- Design should be visually appealing and on-brand

### 4.3 AI Utilization
- Leverage AI for dataset generation and enhancement
- Consider AI-powered difficulty adjustments based on user performance
- Explore AI-driven clue generation possibilities

## 5. Future Enhancements (WIP)

### 5.1 Potential Features
- Difficulty levels for clues (easy, medium, hard)
- Leaderboards and achievement systems
- Timed challenge modes
- Expanded social features (friends list, direct challenges)
- Destination collections and themed challenges
- Mobile app versions

## 6. Timeline and Milestones 
- Pomodor 1: Setup git repo, understand PRD and create own, update data set with one new feature and setup basic file structure and tech stack.
- Pomodor 2: 

### 6.1 Development Phases
- Phase 1: Core game mechanics and backend structure
- Phase 2: User profile and challenge features
- Phase 3: UI/UX polish and optimization
- Phase 4: Testing and bug fixes
- Phase 5: Deployment and launch

## 7. Success Metrics (WIP)

### 7.1 Key Performance Indicators
- User engagement (time spent in app)
- Retention rates
- Challenge invitation conversion rate
- Knowledge retention (measured through repeat correct answers)
