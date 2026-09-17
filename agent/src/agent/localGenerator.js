function inferPattern(emotionText) {
  const emotion = String(emotionText || '').toLowerCase();

  if (emotion.includes('anx')) return 'catastrophic prediction';
  if (emotion.includes('sad') || emotion.includes('hopeless')) return 'hopelessness framing';
  if (emotion.includes('angry') || emotion.includes('frustr')) return 'intent attribution';
  if (emotion.includes('insecure') || emotion.includes('doubt')) return 'self-worth filtering';

  return 'emotion-led filtering';
}

function buildEvidenceSummary(retrievedExamples) {
  const withOutcome = retrievedExamples.filter(example => example.outcomeOneWeekLater || example.revisedInterpretation);
  if (withOutcome.length === 0) {
    return 'In similar cases, first interpretations were often harsher than the eventual outcome.';
  }

  const sample = withOutcome.slice(0, 2);
  const snippets = sample.map(item => {
    const revised = item.revisedInterpretation || 'the revised interpretation became more balanced';
    const outcome = item.outcomeOneWeekLater || 'the one-week outcome was less severe than expected';
    return `${revised}. ${outcome}.`;
  });

  return snippets.join(' ');
}

export function generateWithLocalModel(input, retrievedExamples) {
  const pattern = inferPattern(input.emotion);
  const evidenceSummary = buildEvidenceSummary(retrievedExamples);

  const alternatives = [
    {
      id: 1,
      title: 'AI Interpretation of Your Thought',
      type: 'ai_interpretation',
      alternativeView: `Your current interpretation appears influenced by ${pattern}. The event and emotion are real, but the prediction may be compressing multiple uncertain steps into one negative conclusion.`,
      evidence: evidenceSummary,
      gentleReframe: 'It makes sense to feel this way. A more balanced stance is to treat this as one possibility rather than the final outcome.',
      nextStep: 'Write two other explanations for the event that do not assume the worst intention or result.'
    },
    {
      id: 2,
      title: 'Alternative Perspective: Neutral View',
      type: 'alternate',
      alternativeView: `A neutral observer could read this as an incomplete information moment: "${input.event}" does not automatically prove "${input.interpretation}".`,
      evidence: evidenceSummary,
      gentleReframe: 'Your reaction is understandable, and a neutral reading keeps your options open while you gather facts.',
      nextStep: 'Ask one clarifying question to the relevant person before deciding what this event means.'
    },
    {
      id: 3,
      title: 'Alternative Perspective: Positive Reframe',
      type: 'alternate',
      alternativeView: `This situation could also signal a growth point. Feeling "${input.emotion}" may be your system asking for support, preparation, and a clearer plan rather than predicting failure.`,
      evidence: evidenceSummary,
      gentleReframe: 'You are not wrong to feel stressed. A constructive interpretation is that this is a chance to build a stronger response pattern.',
      nextStep: 'List one strength you already used here and one small action you can take in the next 24 hours.'
    },
    {
      id: 4,
      title: 'Alternative Perspective: Contextual View',
      type: 'alternate',
      alternativeView: 'Outcomes are shaped by context, timing, and other people\'s constraints. Your interpretation may be one thread, but the full system usually has more moving parts than it first appears.',
      evidence: evidenceSummary,
      gentleReframe: 'It is valid to feel alert. Expanding context can reduce certainty pressure and help you choose better next moves.',
      nextStep: 'Pause for five minutes and separate what you can control this week from what you cannot control.'
    }
  ];

  return {
    provider: 'local',
    alternatives
  };
}
