import { connectDB } from './DB/index.js';
import { app } from './app.js';
import dotenv from 'dotenv';
import './cron/hourlyTask.js';

const port = process.env.PORT || 7000;

dotenv.config({
  path: './.env',
});

app.get('/', (req, res) => {
  res.send('Node.js server with cron jobs running!');
});

connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server is running on Port:${port}`);
    })
  )
  .catch((error) => {
    console.log('MongoDB Connection Failed', error);
  });
