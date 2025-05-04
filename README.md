# Audicin Backend Service

A minimal backend service that allows partners to view and license audio tracks securely, built for the Audicin Backend Developer Take-Home Assignment.

## Key Requirements Implemented

### Authentication
- Basic token-based authentication using JWT
- Support for two user roles: 'admin' and 'partner' (separate users with different roles)

### Core API Endpoints
- POST /api/tracks – Admin uploads a new track (title, description, genre)
- GET /api/tracks – Partner fetches list of available tracks
- POST /api/license – Partner licenses a track by trackId
- GET /api/license – Partner views licensed tracks

### Testing
- Test cases for key endpoints using Jest and Supertest

## Project Structure

```
audicin-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication controller
│   │   ├── trackController.js # Track management controller
│   │   └── licenseController.js # License management controller
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── trackRoutes.js     # Track management routes
│   │   └── licenseRoutes.js   # License management routes
│   ├── utils/
│   │   └── jwt.js             # JWT utility functions
│   └── app.js                 # Express application setup
├── tests/
│   └── track.test.js          # Track endpoint tests
├── .gitignore
├── package.json
├── README.md
└── server.js                  # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Yarn (v1.22 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/link2qaiser/audicin-track-api.git
   cd audicin-track-api
   ```

2. Install dependencies
   ```
   yarn install
   ```

3. The database will be initialized automatically when starting the server for the first time. Default users will be created:
   - Admin user: username: `admin`, password: `admin123`
   - Partner user: username: `partner`, password: `partner123`

4. Start the server
   ```
   yarn start
   ```
   
   For development with auto-restart:
   ```
   yarn dev
   ```

5. Run tests
   ```
   yarn test
   ```

## API Overview

### Authentication

- **POST /api/auth/login**: Authenticate user and get token
  ```json
  {
    "username": "user",
    "password": "user123"
  }
  ```

### Tracks Management

- **POST /api/tracks**: Upload a new track
  ```json
  {
    "title": "Song Name",
    "description": "Song description",
    "genre": "Pop"
  }
  ```
  *Requires admin role*

- **GET /api/tracks**: Fetch list of available tracks
  *Requires partner role*

### License Management

- **POST /api/license**: License a track
  ```json
  {
    "trackId": 1
  }
  ```
  *Requires partner role*

- **GET /api/license**: View licensed tracks
  *Requires partner role*


## Running Tests

The project is set up with Jest for automated testing:

```bash
# Run all tests
yarn test
```

## Design Choices

1. **Architecture Pattern**: Used a layered architecture with controllers, services, and models to maintain separation of concerns and promote clean, modular code.

2. **Authentication**: Implemented JWT-based authentication with separate users for admin and partner roles, following the principle of least privilege to ensure proper access controls.

3. **Database**: Used SQLite for simplicity and ease of setup, with properly defined schemas and relationships between entities.

4. **Error Handling**: Implemented a global error handler to ensure consistent error responses across the API.

5. **Testing**: Used Jest and Supertest for API endpoint testing to ensure reliability.

6. **Code Organization**: Structured the project in a modular way to improve readability and maintainability.