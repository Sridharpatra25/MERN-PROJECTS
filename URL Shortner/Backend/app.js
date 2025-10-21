import express from 'express';
import connectDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import short_url from './src/routes/short_url.route.js'
import {redirectFromShortUrl} from './src/controller/short_url.controller.js'
import { errorHandler } from './src/utils/errorHandler.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/create',short_url)

app.get("/:id",redirectFromShortUrl)

app.use(errorHandler)


const PORT = 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});