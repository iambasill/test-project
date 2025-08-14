import express from 'express';
import { rootRoute } from './routes/rootRoute';
import { errorHandler } from './utils/errorHandler';
import cors from 'cors'
import { morganMiddleware } from './utils/logger';
import { PrismaClient } from '../src/generated/prisma';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const prisma = new PrismaClient()
const app = express()
// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
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