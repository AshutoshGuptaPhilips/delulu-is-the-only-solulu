import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';

import { config } from './config/index.js';
import { agentRouter } from './routes/agent.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  req.requestId = randomUUID();
  next();
});

app.get('/', (_req, res) => {
  res.json({
    service: 'solulu-agent-service',
    status: 'ok',
    message: 'Use POST /api/agent/respond to generate alternative realities.',
    endpoints: {
      health: '/health',
      respond: '/api/agent/respond'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/agent', agentRouter);

app.use((req, res) => {
  res.status(404).json({
    requestId: req.requestId,
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    endpoints: {
      root: '/',
      health: '/health',
      respond: '/api/agent/respond'
    }
  });
});

app.use((err, req, res, _next) => {
  console.error('Agent server error', err);
  res.status(err.statusCode || 500).json({
    requestId: req.requestId,
    error: err.message || 'Internal server error'
  });
});

app.listen(config.port, () => {
  console.log(`Solulu agent server running on http://localhost:${config.port}`);
});
