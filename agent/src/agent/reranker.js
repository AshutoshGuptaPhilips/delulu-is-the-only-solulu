function tokenize(value) {
  return new Set(
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
  );
}

function jaccardSimilarity(a, b) {
  if (a.size === 0 && b.size === 0) {
    return 1;
  }

  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) {
      intersection += 1;
    }
  }

  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isDiverseCandidate(candidate, selected) {
  const candidateTokens = tokenize(candidate.alternativeView);
  return selected.every(item => {
    const selectedTokens = tokenize(item.alternativeView);
    return jaccardSimilarity(candidateTokens, selectedTokens) < 0.72;
  });
}

export function rerankAlternatives(scoredAlternatives, limit = 4) {
  const sorted = [...scoredAlternatives].sort((a, b) => b.score - a.score);
  const selected = [];

  const bestInterpretation = sorted.find(item => item.type === 'ai_interpretation');
  if (bestInterpretation) {
    selected.push(bestInterpretation);
  }

  for (const candidate of sorted) {
    if (selected.length >= limit) {
      break;
    }

    if (selected.some(item => item.title === candidate.title && item.alternativeView === candidate.alternativeView)) {
      continue;
    }

    if (selected.length === 0 || isDiverseCandidate(candidate, selected)) {
      selected.push(candidate);
    }
  }

  if (selected.length < limit) {
    for (const candidate of sorted) {
      if (selected.length >= limit) {
        break;
      }

      if (!selected.some(item => item.title === candidate.title && item.alternativeView === candidate.alternativeView)) {
        selected.push(candidate);
      }
    }
  }

  return selected.slice(0, limit).map((item, index) => ({
    ...item,
    id: index + 1
  }));
}
