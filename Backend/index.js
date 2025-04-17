import { connectDB } from './DB/index.js';
import { app } from './app.js';
import dotenv from 'dotenv';
const port = process.env.PORT || 7000;

dotenv.config({
  path: './.env',
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
