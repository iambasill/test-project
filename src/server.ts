import express from 'express';
import { rootRoute } from './routes/rootRoute';
import { errorHandler } from './utils/errorHandler';
import cors from 'cors';
import { morganMiddleware } from './logger/logger';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { config } from './config';

const app = express();

// ----------------------
//  CORS CONFIG
// ----------------------
const corsOptions = {
  // origin: config.CLIENT_URL,      
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  credentials: true,
};

app.use(cors(corsOptions));

// ----------------------
//  RATE LIMIT PER USER/IP
// ----------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per windowMs per user
  message: "Too many requests from this IP/user, try again later.",
  
  //  KEY: Rate limit per user ID or IP
  keyGenerator: (req) => {
    // If authenticated, use user ID; otherwise use IP
    const user = req.user as any;
    return user?.id || req.ip || 'unknown';
  },
  
  // Standardize IP extraction
  standardHeaders: true,
  legacyHeaders: false,
  
  skip: (req) => req.method === "OPTIONS"
});

app.use('/api', limiter);

// ----------------------
//  SPEED THROTTLE PER USER/IP
// ----------------------
const throttle = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Start slowing after 100 requests
  delayMs: () => 500, // Add 500ms delay per request after limit
  
  //  KEY: Throttle per user ID or IP
  keyGenerator: (req) => {
    const user = req.user as any;
    return user?.id || req.ip || 'unknown';
  },
  
  skip: (req) => req.method === "OPTIONS"
});

app.use('/api', throttle);

// ----------------------
// Logger
// ----------------------
app.use(morganMiddleware);

// ----------------------
// Body parsers
// ----------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------------------
// Routes
// ----------------------
app.use('/', rootRoute);

// ----------------------
// Error handler
// ----------------------
app.use(errorHandler);

// ----------------------
// Server Start
// ----------------------
app.listen(config.PORT, () => {
  console.log(`Connected to port ${config.PORT}`);
});