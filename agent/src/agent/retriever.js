import fs from 'node:fs/promises';
import path from 'node:path';

import { config } from '../config/index.js';

let datasetCache = null;

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function tokenize(value) {
  return new Set(
    normalizeText(value)
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
  );
}

function overlapScore(setA, setB) {
  if (setA.size === 0 || setB.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.sqrt(setA.size * setB.size);
}

function toExample(item, sourceFile, index) {
  return {
    id: `${sourceFile}:${item.id || index + 1}`,
    sourceFile,
    category: item.category || 'General',
    event: item.event || '',
    emotion: item.emotion || '',
    interpretation: item.rawInterpretation || item.interpretation || '',
    alternateRealityChecks: Array.isArray(item.alternateRealityChecks) ? item.alternateRealityChecks : [],
    revisedInterpretation: item.revisedInterpretation || '',
    outcomeOneWeekLater: item.outcomeOneWeekLater || ''
  };
}

async function loadDatasetExamples() {
  if (datasetCache) {
    return datasetCache;
  }

  const files = (await fs.readdir(config.paths.datasetDir))
    .filter(name => name.toLowerCase().endsWith('.json'))
    .sort();

  const examples = [];

  for (const file of files) {
    const fullPath = path.join(config.paths.datasetDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      continue;
    }

    data.forEach((item, index) => {
      examples.push(toExample(item, file, index));
    });
  }

  datasetCache = examples;
  return datasetCache;
}

export async function retrieveExamples(input, topK = config.topKExamples) {
  const all = await loadDatasetExamples();

  const inputEventTokens = tokenize(input.event);
  const inputEmotionTokens = tokenize(input.emotion);
  const inputInterpretationTokens = tokenize(input.interpretation);

  const scored = all.map(example => {
    const eventScore = overlapScore(inputEventTokens, tokenize(example.event));
    const emotionScore = overlapScore(inputEmotionTokens, tokenize(example.emotion));
    const interpretationScore = overlapScore(
      inputInterpretationTokens,
      tokenize(example.interpretation)
    );

    const score = eventScore * 0.45 + emotionScore * 0.2 + interpretationScore * 0.35;

    return {
      ...example,
      retrievalScore: Number(score.toFixed(4))
    };
  });

  return scored
    .sort((a, b) => b.retrievalScore - a.retrievalScore)
    .slice(0, Math.max(1, topK));
}
