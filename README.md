# budget.track

A simple student budget and expense tracker.

## Stack
- **Backend**: Express + in-memory store (swap for SQLite/Postgres easily)
- **Frontend**: React (Create React App)

## Quick Start

```bash
# 1. Install everything
npm run install:all

# 2. Run both servers together
npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:3001

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/entries` | List all entries |
| POST | `/api/entries` | Create an entry |
| DELETE | `/api/entries/:id` | Delete an entry |

## Extending

- **Add a DB**: Replace the `entries` array in `server/index.js` with a real DB client
- **Add auth**: Drop in a JWT middleware before your routes
- **Add charts**: `recharts` or `chart.js` plug straight into the React component
- **Edit entries**: Add a `PUT /api/entries/:id` route + edit UI in `App.jsx`
