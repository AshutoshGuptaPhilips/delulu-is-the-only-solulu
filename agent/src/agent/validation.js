function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateAgentRequest(payload, config) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['Request body must be a JSON object'],
      data: null
    };
  }

  const event = typeof payload.event === 'string' ? payload.event.trim() : '';
  const emotion = typeof payload.emotion === 'string' ? payload.emotion.trim() : '';
  const interpretation = typeof payload.interpretation === 'string' ? payload.interpretation.trim() : '';

  if (!isNonEmptyString(event)) {
    errors.push('event is required');
  }
  if (!isNonEmptyString(emotion)) {
    errors.push('emotion is required');
  }
  if (!isNonEmptyString(interpretation)) {
    errors.push('interpretation is required');
  }

  if (event.length > config.maxEventLength) {
    errors.push(`event cannot exceed ${config.maxEventLength} characters`);
  }
  if (emotion.length > config.maxEmotionLength) {
    errors.push(`emotion cannot exceed ${config.maxEmotionLength} characters`);
  }
  if (interpretation.length > config.maxInterpretationLength) {
    errors.push(`interpretation cannot exceed ${config.maxInterpretationLength} characters`);
  }

  const exerciseId = typeof payload.exerciseId === 'string' ? payload.exerciseId : null;
  const conversationId = typeof payload.conversationId === 'string' ? payload.conversationId : null;

  return {
    valid: errors.length === 0,
    errors,
    data: {
      event,
      emotion,
      interpretation,
      exerciseId,
      conversationId
    }
  };
}
