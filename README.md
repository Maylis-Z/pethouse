# PawPals DZ (Pet House) – Full-Stack E-Commerce

**Student:** Maylis Zerguini
**Module:** WAMD – TD-TP 3 and TD-TP 4 (ENSTA)

## Application description

PawPals DZ is an online pet shop. TD-TP 3 adds a REST API backend
(Node.js, Express, MongoDB) with user registration, login, JWT
authentication, OAuth 2.0 testing and rate limiting. TD-TP 4 connects the
React frontend from TD-TP 2 to this API: products are loaded from MongoDB,
users can register and log in, and logged-in users can add, edit and delete
products.

## Technologies used

- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, jsonwebtoken,
  bcrypt, express-rate-limit, cors, dotenv
- **Frontend:** React (Vite), Redux Toolkit, React Router, Axios
- **Testing:** Thunder Client
- **Version control:** Git / GitHub

## Project structure

```
E-Commerce/
├── backend/    config, controllers, middleware, models, routes, server.js
└── frontend/   React application
```

## Database models

**Product**

| Field | Description |
|-------|-------------|
| name | Product name |
| animal | dog, cat, bird, rabbit, fish, small |
| type | food, toys, accessory, equipment, care |
| price | Price in DA |
| image | Image path |
| description | Product description |
| stock | Quantity in stock |

**User**

| Field | Description |
|-------|-------------|
| name | Full name |
| email | Unique email address |
| password | Password stored as a bcrypt hash, never in plain text |

Both collections are stored in the same MongoDB database and managed with Mongoose.

## API endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose | Access |
|--------|----------|---------|--------|
| POST | /auth/register | Register a new user | Public |
| POST | /auth/login | Log in and receive a JWT | Public (5 requests / 15 min) |
| GET | /auth/me | Returns the authenticated user | JWT or OAuth 2.0 token |
| GET | /products | Get all products | Public |
| GET | /products/:id | Get one product | Public |
| POST | /products | Create a product | JWT required |
| PUT | /products/:id | Update a product | JWT required |
| DELETE | /products/:id | Delete a product | JWT required |

Status codes used: 200, 201, 400, 401, 404, 409, 429, 500.
Errors are returned as JSON: `{ "message": "..." }`.

## JWT authentication

1. The user registers (`/auth/register`): the password is hashed with bcrypt
   and the user is saved in MongoDB. A duplicate email returns 409.
2. The user logs in (`/auth/login`): the password is compared with the stored
   hash. On success, the server signs a JWT with the `JWT_SECRET`
   environment variable and returns it.
3. The client sends the token with each protected request:
   `Authorization: Bearer <JWT_TOKEN>`.
4. The `protect` middleware verifies the token, loads the user from MongoDB
   and continues the request. A missing or invalid token returns 401.

On the frontend, the token is stored in Redux and `localStorage`, and an
Axios interceptor adds it to every request automatically.

## OAuth 2.0 testing

An OAuth 2.0 client was created in Google Cloud Console. In Thunder Client,
an access token was obtained with the Authorization Code flow (scope
`openid email profile`) and sent to the protected `GET /api/auth/me` endpoint.
The `protect` middleware accepts either the application's own JWT or a Google
access token, which it validates with Google's userinfo endpoint. A request
without a token returns 401.

## Rate limiting

Implemented with `express-rate-limit`:

- General limit on `/api`: 100 requests per 15 minutes per IP
- Login endpoint: 5 requests per 15 minutes per IP

When a limit is exceeded, the API returns 429 Too Many Requests.

## Installation and running

Requirements: Node.js 18 or newer, and a MongoDB Atlas account.

**Backend**
```
cd backend
npm install
copy .env.example .env
npm run dev
```
The API runs on `http://localhost:5000`.

**Frontend**
```
cd frontend
npm install
copy .env.example .env
npm run dev
```
The app runs on `http://localhost:5173` (the backend allows this origin through CORS).

## MongoDB and environment variables

1. Create a free cluster on MongoDB Atlas.
2. Create a database user (username and password).
3. In **Network Access**, add your current IP address.
4. Copy the connection string into `backend/.env` and add your database name.

`backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_local_secret
```

`frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

The real `.env` files are excluded from Git through `.gitignore`. Only the
`.env.example` files with placeholders are committed.

## Frontend integration (TD-TP 4)

- Products are fetched from the API, with loading and error states.
- Registration and login pages are connected to the API; the JWT is saved and sent automatically.
- Logged-in users can add, edit and delete products from the interface.
- The shopping cart is still managed by Redux.