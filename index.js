import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//configure env
dotenv.config();

//Database connection
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// deployment
app.use(express.static(path.join( __dirname , './client/build')));

// routes
app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/category' , categoryRoutes);
app.use('/api/v1/product' , productRoutes);


app.use("*" , (req, res)=> {
  res.sendFile(path.join( __dirname , './client/build/index.html'));
})

// rest api
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT  , ()=> {
    console.log(`Server listening on ${PORT}`);
})