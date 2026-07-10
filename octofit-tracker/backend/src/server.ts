import app from './app.js';
import db from './config/database.js';
import { apiBaseUrl } from './config/api-url.js';

const port = Number(process.env.PORT || 8000);

async function startServer() {
  await db.asPromise();

  app.listen(port, () => {
    console.log(`OctoFit Tracker backend listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
