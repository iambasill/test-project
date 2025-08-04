import express from 'express';
import { rootRoute } from './routes/rootRoute';
import { errorHandler } from './utils/errorHandler';
import cors from 'cors'
import { morganMiddleware } from './utils/logger';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()
const app = express()
app.use(morganMiddleware);

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use('/', rootRoute)






















app.use(errorHandler)
app.listen(8000,()=>{
    console.log('connected to port 8000')
})