import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';
import swaggerSpec from './config/swagger';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(
  express.json({
    limit: '10kb'
  })
);
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: null
  }
});

app.use(limiter);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Finance Data Processing and Access Control Backend is running'
  });
});

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'OK'
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;