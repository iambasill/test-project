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
// ✅ CORS CONFIG
// ----------------------
const corsOptions = {
  origin: config.CLIENT_URL,      // e.g. "http://localhost:5173"
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// CRITICAL: allow OPTIONS preflight
app.options("*", cors(corsOptions));


// ----------------------
// ✅ RATE LIMIT (skip OPTIONS)
// ----------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later.",
  skip: (req) => req.method === "OPTIONS"
});

app.use('/api', limiter);


// ----------------------
// ✅ SPEED THROTTLE (skip OPTIONS)
// ----------------------
const throttle = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: () => 500,
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
