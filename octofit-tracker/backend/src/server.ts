import app from './app.js';
import db from './config/database.js';

const port = Number(process.env.PORT || 8000);

async function startServer() {
  await db.asPromise();

  app.listen(port, () => {
    console.log(`OctoFit Tracker backend listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
