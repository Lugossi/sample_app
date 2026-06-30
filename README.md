# Sample App

Sample app with db for testing. A tiny web page that shows a table and writes rows to a PostgreSQL database.

## Stack

- Node.js + Express
- PostgreSQL (`pg`)
- Plain HTML/JS frontend

## Run

1. Start a database:

   ```bash
   docker compose up -d
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open http://localhost:3000

The `entries` table is created automatically on startup.

## Configuration

Copy `.env.example` and set values as needed:

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — HTTP port (default 3000)

## API

- `GET /api/entries` — list entries
- `POST /api/entries` — add an entry (`{ "name": "...", "email": "..." }`)
- `DELETE /api/entries/:id` — remove an entry
