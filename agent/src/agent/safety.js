const HIGH_RISK_INPUT_PATTERNS = [
  /suicide/i,
  /kill\s+myself/i,
  /self\s*-?harm/i,
  /overdose/i,
  /hurt\s+myself/i
];

const HARSH_LANGUAGE_PATTERNS = [
  /you\s+deserve\s+it/i,
  /your\s+fault/i,
  /everyone\s+hates\s+you/i
];

export function collectSafetyFlags(input, alternatives) {
  const flags = [];

  const inputText = `${input.event} ${input.emotion} ${input.interpretation}`;
  if (HIGH_RISK_INPUT_PATTERNS.some(pattern => pattern.test(inputText))) {
    flags.push('high_risk_self_harm_signal');
  }

  const outputText = alternatives
    .map(item => `${item.alternativeView} ${item.gentleReframe} ${item.nextStep}`)
    .join(' ');

  if (HARSH_LANGUAGE_PATTERNS.some(pattern => pattern.test(outputText))) {
    flags.push('harsh_output_language_detected');
  }

  return flags;
}
