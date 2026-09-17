import { config } from '../config/index.js';

function stripCodeFences(text) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

function parseJsonSafe(text) {
  try {
    return JSON.parse(stripCodeFences(text));
  } catch (_error) {
    return null;
  }
}

function normalizeAlternative(item, index) {
  return {
    id: index + 1,
    title: typeof item.title === 'string' ? item.title : `Alternative Perspective ${index + 1}`,
    type: item.type === 'ai_interpretation' ? 'ai_interpretation' : 'alternate',
    alternativeView: typeof item.alternativeView === 'string' ? item.alternativeView : '',
    evidence: typeof item.evidence === 'string' ? item.evidence : '',
    gentleReframe: typeof item.gentleReframe === 'string' ? item.gentleReframe : '',
    nextStep: typeof item.nextStep === 'string' ? item.nextStep : ''
  };
}

function buildUserPrompt(input, examples, outputSchema, rubric) {
  const minimalExamples = examples.slice(0, 4).map(example => ({
    category: example.category,
    event: example.event,
    emotion: example.emotion,
    interpretation: example.interpretation,
    revisedInterpretation: example.revisedInterpretation,
    outcomeOneWeekLater: example.outcomeOneWeekLater
  }));

  return [
    'Create exactly 4 alternative realities for the user input.',
    'Return strict JSON only with the schema requested.',
    '',
    'INPUT:',
    JSON.stringify(input, null, 2),
    '',
    'REFERENCE EXAMPLES:',
    JSON.stringify(minimalExamples, null, 2),
    '',
    'RUBRIC:',
    JSON.stringify(rubric, null, 2),
    '',
    'OUTPUT SCHEMA:',
    JSON.stringify(outputSchema, null, 2),
    '',
    'Requirements:',
    '- Provide one item with type="ai_interpretation" and three with type="alternate".',
    '- Keep each nextStep concrete and short.',
    '- Avoid diagnosis or certainty language.',
    '- Use plausible, emotionally safe reframes.'
  ].join('\n');
}

export async function generateWithOpenAI({ input, retrievedExamples, customization }) {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model: config.openaiModel,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: customization.systemPrompt
        },
        {
          role: 'user',
          content: buildUserPrompt(
            input,
            retrievedExamples,
            customization.outputSchema,
            customization.rubric
          )
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${detail}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonSafe(content);

  if (!parsed || !Array.isArray(parsed.alternatives) || parsed.alternatives.length === 0) {
    throw new Error('OpenAI returned invalid alternatives payload');
  }

  return {
    provider: 'openai',
    alternatives: parsed.alternatives.slice(0, 4).map(normalizeAlternative)
  };
}
