/* ============================================
   SOLULU - AI API
   Mock AI for generating alternate realities
   ============================================ */

class AIReality {
    constructor() {
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions'; // For future integration
        this.useLocalMock = true; // Set to false when real API is ready
    }

    /**
     * Generate alternate realities using mock AI
     * Returns an array of 4 realities:
     * 1. AI interpretation of user's raw interpretation
     * 2-4. Alternate perspectives
     */
    async generateRealities(event, emotion, interpretation) {
        if (this.useLocalMock) {
            return this.generateMockRealities(event, emotion, interpretation);
        }
        // TODO: Implement real API call
    }

    /**
     * Mock AI - Generate realistic alternate realities
     */
    generateMockRealities(event, emotion, interpretation) {
        const prompt = `Event: ${event}\nEmotion: ${emotion}\nInterpretation: ${interpretation}`;

        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                const realities = [
                    {
                        id: 1,
                        title: 'AI Interpretation of Your Thought',
                        type: 'ai_interpretation',
                        content: this.generateAIInterpretation(event, emotion, interpretation)
                    },
                    {
                        id: 2,
                        title: 'Alternative Perspective: Neutral View',
                        type: 'alternate',
                        content: this.generateNeutralPerspective(event, emotion, interpretation)
                    },
                    {
                        id: 3,
                        title: 'Alternative Perspective: Positive Reframe',
                        type: 'alternate',
                        content: this.generatePositivePerspective(event, emotion, interpretation)
                    },
                    {
                        id: 4,
                        title: 'Alternative Perspective: Contextual View',
                        type: 'alternate',
                        content: this.generateContextualPerspective(event, emotion, interpretation)
                    }
                ];

                resolve(realities);
            }, 2000); // Simulate 2-second API call
        });
    }

    /**
     * Generate AI interpretation of the user's raw interpretation
     */
    generateAIInterpretation(event, emotion, interpretation) {
        const interpretations = [
            `Based on your description of "${event}", your current interpretation shows signs of ${this.getEmotionPattern(emotion)}. This is understandable given the situation. However, it's worth noting that this interpretation might be influenced by your current emotional state. The reality is likely to be more nuanced than this immediate prediction. While your concerns are valid, the actual outcome may depend on factors you can influence or that may not unfold exactly as predicted.`,

            `Your interpretation that "${interpretation}" reflects concerns that many people have in similar situations. The emotion of ${emotion} is a natural response. However, this initial thought pattern is often a default response in uncertain situations rather than a certainty. It's useful to recognize that this is your mind's attempt to protect you by anticipating negative outcomes. Reality often has more flexibility and possibilities than our initial interpretations suggest.`,

            `I understand why you feel ${emotion} and interpret the situation this way: "${interpretation}". Your reasoning is logical based on current information. However, humans tend to weight negative possibilities more heavily when anxious or uncertain. What's actually likely to happen involves more variables than we typically consider in the moment. Your prediction reflects worry more than probability.`,

            `Your interpretation reveals that you're focusing on: "${interpretation}". This suggests you're in a protective mindset due to feeling ${emotion}. While staying alert is healthy, this state can narrow our perception. The actual situation probably involves some elements you're predicting, but also unexpected variables. Consider that your brain may be rehearsing worst-case scenarios rather than calculating actual probabilities.`
        ];

        return this.getRandomElement(interpretations);
    }

    /**
     * Generate a neutral, balanced perspective
     */
    generateNeutralPerspective(event, emotion, interpretation) {
        const perspectives = [
            `Looking at "${event}" without emotional coloring: People respond to situations based on many factors including their own experiences, pressures, and misunderstandings. Your interpretation assumes certain intentions or outcomes, but most situations are more complex. ${this.getEmotionPattern(emotion)} can make us see threats where there might be neutrality or even indifference. The most likely outcome is probably somewhere between your worry and your hopes.`,

            `Stepping back objectively: "${event}" is likely being interpreted differently by different people involved. What feels significant to you may have been routine for others. Your assumption that "${interpretation}" is one possibility among many. People often have more neutral reactions than we assume when we're feeling ${emotion}. The situation may simply unfold without the dramatic consequences you're anticipating.`,

            `A neutral analysis suggests: People are usually focused on their own concerns rather than judging or acting against others. In "${event}", the most probable outcome is that others are managing their own situations and may not have given much thought to their actions regarding you. Your feeling of ${emotion} is real, but the threat level may be lower than it feels. Neutral parties observing would likely see a much more ordinary situation.`,

            `Without the lens of ${emotion}: "${event}" is a normal occurrence that happens in many interactions. People are generally trying to meet their own needs, not orchestrating complex responses against you. Your interpretation of "${interpretation}" assumes a level of intentionality that is often not present. The reality is likely more mundane—people simply going about their day, with your situation being much less central to their thoughts than you assume.`
        ];

        return this.getRandomElement(perspectives);
    }

    /**
     * Generate a positive reframe perspective
     */
    generatePositivePerspective(event, emotion, interpretation) {
        const perspectives = [
            `A more hopeful interpretation: "${event}" might actually present an opportunity you're not currently seeing. Your feeling of ${emotion} can blind us to positive signals. What if "${interpretation}" is actually inaccurate, and instead something positive is developing? People often prove more supportive than we expect when we're vulnerable. This moment might become a turning point toward better outcomes.`,

            `Positive possibility: Maybe "${event}" indicates that change is coming—change that could be beneficial. Your ${emotion} is alert to a shift, but shifts can go in many directions. What if your interpretation reveals more about your fears than the actual situation? Many people who felt the way you do in similar circumstances found that things improved unexpectedly. This could be one of those moments.`,

            `Potential upside: "${event}" might be showing you something valuable about yourself or your relationships. Rather than "${interpretation}", what if this is actually a test you'll pass? Your ${emotion} might be preparing you to handle this better than you think you can. Sometimes the worst we imagine never happens, but instead we gain confidence from facing our fears.`,

            `Optimistic lens: Perhaps "${event}" is not the ending you fear but a beginning. Your brain is predicting problems, but what if "${interpretation}" is just your mind's default anxiety? Many people going through similar situations discovered that the outcome was better than their fears suggested. Your resilience might surprise you. This situation might ultimately strengthen rather than damage.`
        ];

        return this.getRandomElement(perspectives);
    }

    /**
     * Generate a contextual/systemic perspective
     */
    generateContextualPerspective(event, emotion, interpretation) {
        const perspectives = [
            `In context: "${event}" doesn't exist in isolation. Many external factors influence outcomes—timing, coincidence, other people's limitations or distractions. Your interpretation that "${interpretation}" assumes a controlled system, but life is messier and more random than that. Your ${emotion} is treated as data, but it's just one input. External factors you can't control or even perceive will significantly shape what actually happens.`,

            `Systems perspective: "${event}" is affected by larger patterns you might not see. The business cycle, other people's stress, random chance—all these influence outcomes as much as any single action or interpretation. Your feeling of ${emotion} is valid, but the system doesn't necessarily move based on your predicted logic. "${interpretation}" might be true, false, or irrelevant depending on factors outside the situation entirely. Reality emerges from complex interactions, not just the narrative you're telling yourself.`,

            `Broader context: When we zoom out, "${event}" is a small moment in a much larger pattern. Your interpretation focuses on one possible narrative, but contexts shift daily. The impact of "${event}" depends partly on what everyone involved has going on in their other lives. Your ${emotion} is understandable but localized. In weeks or months, this might be completely reframed by new information and changing circumstances.`,

            `Systemic view: "${event}" is influenced by power dynamics, organizational realities, and human limitations you may not be aware of. Your interpretation that "${interpretation}" may or may not account for these invisible systems. People's responses are constrained by policies, pressures, and their own capacity. Your ${emotion}} is real, but the actual mechanics of what unfolds will involve many factors beyond your interpretation. The system is more complex than any individual's narrative about it.`
        ];

        return this.getRandomElement(perspectives);
    }

    /**
     * Get emotion pattern based on emotion type
     */
    getEmotionPattern(emotion) {
        const lowerEmotion = emotion.toLowerCase();

        if (lowerEmotion.includes('anxiety') || lowerEmotion.includes('anxious') || lowerEmotion.includes('worry')) {
            return 'catastrophic thinking';
        } else if (lowerEmotion.includes('sad') || lowerEmotion.includes('depressed')) {
            return 'hopelessness bias';
        } else if (lowerEmotion.includes('angry') || lowerEmotion.includes('furious')) {
            return 'blame attribution';
        } else if (lowerEmotion.includes('insecure') || lowerEmotion.includes('doubt')) {
            return 'self-doubt amplification';
        } else if (lowerEmotion.includes('shame') || lowerEmotion.includes('embarrass')) {
            return 'social threat perception';
        }

        return 'emotional filtering';
    }

    /**
     * Get random element from array
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Validate inputs
     */
    validateInputs(event, emotion, interpretation) {
        const errors = [];

        if (!event || event.trim().length === 0) {
            errors.push('Please describe the event');
        }
        if (!emotion || emotion.trim().length === 0) {
            errors.push('Please describe your emotion');
        }
        if (!interpretation || interpretation.trim().length === 0) {
            errors.push('Please describe your interpretation');
        }

        if (event.length > 500) {
            errors.push('Event description is too long (max 500 characters)');
        }
        if (emotion.length > 300) {
            errors.push('Emotion description is too long (max 300 characters)');
        }
        if (interpretation.length > 500) {
            errors.push('Interpretation description is too long (max 500 characters)');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Format reality for display
     */
    formatReality(reality) {
        return {
            ...reality,
            number: reality.id,
            isAIInterpretation: reality.type === 'ai_interpretation'
        };
    }
}

// Create global instance
const aiReality = new AIReality();
