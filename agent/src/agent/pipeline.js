import { config } from '../config/index.js';
import { loadAgentCustomization } from './customizationStore.js';
import { retrieveExamples } from './retriever.js';
import { generateWithOllama } from './ollamaGenerator.js';
import { generateWithOpenAI } from './openAiGenerator.js';
import { generateWithLocalModel } from './localGenerator.js';
import { scoreAlternatives } from './critic.js';
import { rerankAlternatives } from './reranker.js';
import { collectSafetyFlags } from './safety.js';

function unique(items) {
  return [...new Set(items)];
}

function toPercent(value) {
  return Number((value * 100).toFixed(1));
}

function buildAnswer(alternatives) {
  const lines = alternatives.map(item => `${item.id}. ${item.title}: ${item.gentleReframe}`);
  return `Here are four grounded alternative realities based on your input.\n${lines.join('\n')}`;
}

function calculateConfidenceScore(alternatives, safetyFlags) {
  if (alternatives.length === 0) {
    return 0;
  }

  const avgScore = alternatives.reduce((sum, item) => sum + item.score, 0) / alternatives.length;
  const safetyPenalty = safetyFlags.length * 0.08;
  return Math.max(0, Math.min(100, toPercent(avgScore - safetyPenalty)));
}

function formatAlternative(item) {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    alternativeView: item.alternativeView,
    evidence: item.evidence,
    gentleReframe: item.gentleReframe,
    nextStep: item.nextStep,
    rubricScore: toPercent(item.score)
  };
}

export async function runAgentPipeline(input, options = {}) {
  const customization = await loadAgentCustomization();
  const retrievedExamples = await retrieveExamples(input, config.topKExamples);

  let generated;
  const provider = String(config.modelProvider || 'ollama').toLowerCase();

  if (provider === 'ollama') {
    try {
      generated = await generateWithOllama({
        input,
        retrievedExamples,
        customization
      });
    } catch (error) {
      console.warn('Ollama generation failed. Falling back to local model.', error.message);
    }
  } else if (provider === 'openai' && config.openaiApiKey) {
    try {
      generated = await generateWithOpenAI({
        input,
        retrievedExamples,
        customization
      });
    } catch (error) {
      console.warn('OpenAI generation failed. Falling back to local model.', error.message);
    }
  }

  if (!generated) {
    generated = generateWithLocalModel(input, retrievedExamples);
  }

  const scored = scoreAlternatives(input, generated.alternatives, customization.rubric);
  const reranked = rerankAlternatives(scored, 4);
  const safetyFlags = collectSafetyFlags(input, reranked);
  const confidenceScore = calculateConfidenceScore(reranked, safetyFlags);
  const suggestedActions = unique(reranked.map(item => item.nextStep).filter(Boolean)).slice(0, 3);

  const response = {
    requestId: options.requestId || null,
    provider: generated.provider,
    answer: buildAnswer(reranked),
    confidenceScore,
    safetyFlags,
    suggestedActions,
    alternatives: reranked.map(formatAlternative)
  };

  if (config.allowDebug) {
    response.debug = {
      retrieval: retrievedExamples.map(example => ({
        id: example.id,
        sourceFile: example.sourceFile,
        category: example.category,
        retrievalScore: example.retrievalScore
      })),
      rubric: customization.rubric
    };
  }

  return response;
}
