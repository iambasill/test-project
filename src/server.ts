import express from 'express';
import { rootRoute } from './routes/rootRoute';
import { errorHandler } from './utils/errorHandler';
import cors from 'cors'
import { morganMiddleware } from './utils/logger';
import { PrismaClient } from '../src/generated/prisma';

export const prisma = new PrismaClient()
const app = express()

app.use(morganMiddleware);

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // origin: 'http://your-frontend-domain.com',
  // credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/', rootRoute)






















app.use(errorHandler)
app.listen(8000,()=>{
    console.log('connected to port 8000')
})