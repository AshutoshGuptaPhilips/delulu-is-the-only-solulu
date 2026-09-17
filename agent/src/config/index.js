import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const agentRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(agentRoot, '..');

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toFloat(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  return String(value).toLowerCase() === 'true';
}

export const config = {
  port: toInt(process.env.PORT, 8787),
  modelProvider: process.env.MODEL_PROVIDER || 'ollama',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  ollamaTemperature: toFloat(process.env.OLLAMA_TEMPERATURE, 0.4),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  topKExamples: toInt(process.env.TOP_K_EXAMPLES, 6),
  allowDebug: toBoolean(process.env.ALLOW_DEBUG, false),
  maxEventLength: 500,
  maxEmotionLength: 300,
  maxInterpretationLength: 500,
  paths: {
    agentRoot,
    repoRoot,
    datasetDir: path.join(repoRoot, 'dataset'),
    systemPromptPath: path.join(agentRoot, 'config', 'system-prompt.md'),
    rubricPath: path.join(agentRoot, 'config', 'rubric.json'),
    outputSchemaPath: path.join(agentRoot, 'config', 'output-schema.json')
  }
};
