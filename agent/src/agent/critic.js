function tokenize(value) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
  );
}

function overlapRatio(a, b) {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of a) {
    if (b.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.min(a.size, b.size);
}

function containsAny(text, words) {
  const lower = String(text || '').toLowerCase();
  return words.some(word => lower.includes(word));
}

function getDimensionWeightMap(rubric) {
  const defaults = {
    grounded: 0.25,
    plausible: 0.2,
    emotionally_safe: 0.2,
    cognitive_balance: 0.2,
    actionable: 0.15
  };

  if (!rubric || !Array.isArray(rubric.dimensions)) {
    return defaults;
  }

  const map = { ...defaults };
  rubric.dimensions.forEach(dimension => {
    if (dimension && typeof dimension.id === 'string' && typeof dimension.weight === 'number') {
      map[dimension.id] = dimension.weight;
    }
  });

  return map;
}

function scoreGrounded(input, item) {
  const inputTokens = tokenize(`${input.event} ${input.emotion} ${input.interpretation}`);
  const outputTokens = tokenize(`${item.alternativeView} ${item.evidence} ${item.gentleReframe}`);
  const overlap = overlapRatio(inputTokens, outputTokens);
  return Math.max(0, Math.min(1, overlap * 1.2));
}

function scorePlausible(item) {
  const text = `${item.alternativeView} ${item.evidence}`;
  const certaintyMarkers = ['always', 'never', 'guaranteed', '100%', 'certainly'];
  const fantasyMarkers = ['magic', 'superpower', 'miracle'];

  let score = 1;
  if (containsAny(text, certaintyMarkers)) {
    score -= 0.35;
  }
  if (containsAny(text, fantasyMarkers)) {
    score -= 0.5;
  }

  return Math.max(0, Math.min(1, score));
}

function scoreEmotionallySafe(item) {
  const empathyMarkers = ['it makes sense', 'understandable', 'valid', 'you are not wrong to feel'];
  const harshMarkers = ['your fault', 'you deserve', 'weak', 'stupid'];

  let score = 0.55;
  if (containsAny(item.gentleReframe, empathyMarkers) || containsAny(item.alternativeView, empathyMarkers)) {
    score += 0.3;
  }
  if (containsAny(item.alternativeView, harshMarkers) || containsAny(item.gentleReframe, harshMarkers)) {
    score -= 0.6;
  }

  return Math.max(0, Math.min(1, score));
}

function scoreCognitiveBalance(item) {
  const uncertaintyMarkers = ['might', 'may', 'could', 'possibly', 'one possibility'];
  const absolutistMarkers = ['definitely', 'always', 'never'];

  let score = 0.45;
  if (containsAny(item.alternativeView, uncertaintyMarkers)) {
    score += 0.4;
  }
  if (containsAny(item.alternativeView, absolutistMarkers)) {
    score -= 0.25;
  }

  return Math.max(0, Math.min(1, score));
}

function scoreActionable(item) {
  const nextStep = String(item.nextStep || '').trim();
  if (!nextStep) {
    return 0;
  }

  const actionVerbs = [
    'write',
    'ask',
    'pause',
    'list',
    'check',
    'clarify',
    'breathe',
    'schedule',
    'note'
  ];

  let score = nextStep.length >= 20 ? 0.65 : 0.45;
  if (actionVerbs.some(verb => nextStep.toLowerCase().startsWith(verb))) {
    score += 0.25;
  }

  return Math.max(0, Math.min(1, score));
}

export function scoreAlternatives(input, alternatives, rubric) {
  const weights = getDimensionWeightMap(rubric);

  return alternatives.map(item => {
    const perDimension = {
      grounded: scoreGrounded(input, item),
      plausible: scorePlausible(item),
      emotionally_safe: scoreEmotionallySafe(item),
      cognitive_balance: scoreCognitiveBalance(item),
      actionable: scoreActionable(item)
    };

    const weightedTotal =
      perDimension.grounded * weights.grounded +
      perDimension.plausible * weights.plausible +
      perDimension.emotionally_safe * weights.emotionally_safe +
      perDimension.cognitive_balance * weights.cognitive_balance +
      perDimension.actionable * weights.actionable;

    return {
      ...item,
      evaluation: perDimension,
      score: Number(weightedTotal.toFixed(4))
    };
  });
}
