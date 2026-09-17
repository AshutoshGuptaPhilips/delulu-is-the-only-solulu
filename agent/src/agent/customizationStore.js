import fs from 'node:fs/promises';

import { config } from '../config/index.js';

const DEFAULT_RUBRIC = {
  dimensions: [
    { id: 'grounded', weight: 0.25 },
    { id: 'plausible', weight: 0.2 },
    { id: 'emotionally_safe', weight: 0.2 },
    { id: 'cognitive_balance', weight: 0.2 },
    { id: 'actionable', weight: 0.15 }
  ]
};

const DEFAULT_SCHEMA = {
  type: 'object',
  required: ['alternatives'],
  properties: {
    alternatives: {
      type: 'array'
    }
  }
};

async function readTextOrDefault(filePath, fallback) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (_error) {
    return fallback;
  }
}

async function readJsonOrDefault(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (_error) {
    return fallback;
  }
}

export async function loadAgentCustomization() {
  const [systemPrompt, rubric, outputSchema] = await Promise.all([
    readTextOrDefault(config.paths.systemPromptPath, 'You are a supportive cognitive reframing coach.'),
    readJsonOrDefault(config.paths.rubricPath, DEFAULT_RUBRIC),
    readJsonOrDefault(config.paths.outputSchemaPath, DEFAULT_SCHEMA)
  ]);

  return {
    systemPrompt,
    rubric,
    outputSchema
  };
}
