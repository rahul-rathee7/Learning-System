import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: '*',
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        statusCode: 404 
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on ('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});