MongoDB Atlas setup (backend)

This backend supports storing locations either in a local JSON file (`locations.json`) or in MongoDB Atlas when the environment variable `MONGODB_URI` is set.

Quick setup with MongoDB Atlas:

1. Create a MongoDB Atlas cluster (free tier possible).
2. Create a database user and note the connection string. It looks like:
   mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/<dbname>?retryWrites=true&w=majority
3. In your Render (or Vercel) service settings, set the environment variable `MONGODB_URI` to that connection string.

Behavior:
- If `MONGODB_URI` is present and reachable, the backend writes incoming locations to the `locations` collection in your Atlas DB.
- If `MONGODB_URI` is missing or the DB is unreachable, the backend falls back to appending into `backend/locations.json`.

Endpoints:
- `POST /location` — accept JSON { user, lat, lng, device_name?, device_type? } and store it.
- `GET /locations` — returns recent stored locations (from DB or file).
- `POST /clear-locations` — clears stored locations (DB collection or file).

Notes for Render/Vercel:
- On Render, files written to disk are ephemeral and get reset on redeploy; use `MONGODB_URI` for persistent storage.
- Add `MONGODB_URI` to your service environment variables in the dashboard.

Security:
- Keep `MONGODB_URI` secret; do not commit it to Git.
- Consider adding authentication to the `/location` endpoint if you want to restrict writes.
