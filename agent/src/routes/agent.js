import express from 'express';

import { config } from '../config/index.js';
import { validateAgentRequest } from '../agent/validation.js';
import { runAgentPipeline } from '../agent/pipeline.js';

export const agentRouter = express.Router();

agentRouter.post('/respond', async (req, res, next) => {
  try {
    const validation = validateAgentRequest(req.body, config);

    if (!validation.valid) {
      return res.status(400).json({
        requestId: req.requestId,
        error: 'Invalid request payload',
        details: validation.errors
      });
    }

    const response = await runAgentPipeline(validation.data, {
      requestId: req.requestId
    });

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

agentRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
