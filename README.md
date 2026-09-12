# ClimateRoute Frontend

Premium React/Vite frontend for the ClimateRoute hackathon MVP.

## Backend contract

The frontend calls:

`POST http://127.0.0.1:8000/route`

Request body:

```json
{
  "start": "Delhi",
  "destination": "Noida",
  "vehicle": "car",
  "departure_time": "16:30"
}
```

The URL can be changed with `VITE_API_URL`.

## Run

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env` if you want to change the API URL.
5. Start the FastAPI backend first (normally on port 8000).
6. Run `npm run dev`.

## Build

`npm run build`

## Important MVP note

The current FastAPI backend returns route metrics but does not return latitude/longitude or real road geometry. The frontend therefore keeps the existing polished prototype route lines for the visual map while displaying the live climate metrics and recommendation returned by FastAPI. Replace the path generation later when the backend provides real route geometry.

## ZIP hygiene

Do not include `node_modules`, `.git`, `dist`, or Python virtual environments in a source ZIP.
