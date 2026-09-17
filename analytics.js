/* ============================================
   SOLULU - Analytics & Pattern Insights
   Analyzes exercises to find patterns
   ============================================ */

class PatternAnalytics {
    constructor() {
        this.categories = [
            'Workplace Pattern Insights',
            'Relationship Pattern Insights',
            'Social Situation Insights',
            'General Insights'
        ];
        this.themeKeywords = {
            'delayed_response': ['late', 'slow', 'delayed', 'didn\'t respond', 'no reply'],
            'feedback_discussion': ['feedback', 'criticism', 'comment', 'review', 'critique'],
            'disagreement': ['disagree', 'argue', 'conflict', 'different opinion', 'opposed'],
            'miscommunication': ['misunderstood', 'confusion', 'unclear', 'mixed message'],
            'performance_concern': ['mistake', 'error', 'fail', 'not good enough', 'incompetent'],
            'social_pressure': ['judge', 'watch', 'observe', 'stare', 'attention'],
            'rejection': ['ignore', 'exclude', 'left out', 'rejected', 'not invited']
        };

        this.assumptionMarkers = [
            'will', 'definitely', 'always', 'never', 'everyone', 'nobody', 'they think',
            'must mean', 'for sure', 'ruined', 'disaster', 'worst', 'no way'
        ];

        this.factMarkers = [
            'i saw', 'i heard', 'they said', 'the message', 'the email', 'happened',
            'at', 'on', 'evidence', 'fact', 'data', 'confirmed', 'actually', 'observed'
        ];
    }

    /**
     * Categorize an exercise based on content
     */
    categorizeExercise(exercise) {
        const text = (
            exercise.event + ' ' +
            exercise.emotion + ' ' +
            exercise.interpretation
        ).toLowerCase();

        if (this.containsWorkplaceKeywords(text)) {
            return 'Workplace Pattern Insights';
        } else if (this.containsRelationshipKeywords(text)) {
            return 'Relationship Pattern Insights';
        } else if (this.containsSocialKeywords(text)) {
            return 'Social Situation Insights';
        } else {
            return 'General Insights';
        }
    }

    containsWorkplaceKeywords(text) {
        const keywords = [
            'work', 'job', 'boss', 'manager', 'colleague', 'team', 'meeting',
            'feedback', 'performance', 'deadline', 'project', 'office', 'email',
            'presentation', 'promotion', 'colleague', 'coworker', 'workplace'
        ];
        return keywords.some(kw => text.includes(kw));
    }

    containsRelationshipKeywords(text) {
        const keywords = [
            'friend', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'husband',
            'wife', 'family', 'parent', 'mother', 'father', 'brother', 'sister',
            'relationship', 'dating', 'love', 'breakup', 'argument', 'conflict'
        ];
        return keywords.some(kw => text.includes(kw));
    }

    containsSocialKeywords(text) {
        const keywords = [
            'party', 'event', 'gathering', 'social', 'people', 'crowd', 'public',
            'embarrass', 'judg', 'anxiety', 'nervou', 'awkward', 'group'
        ];
        return keywords.some(kw => text.includes(kw));
    }

    /**
     * Analyze exercises in a category
     */
    analyzeCategory(category, exercises) {
        // Filter exercises for this category
        const categoryExercises = exercises.filter(
            ex => this.categorizeExercise(ex) === category
        );

        if (categoryExercises.length === 0) {
            return null;
        }

        // Analyze patterns
        const timeframe = this.getTimeframeCount(categoryExercises);
        const whatHappened = this.extractWhatHappened(categoryExercises);
        const emotionalPatterns = this.analyzeEmotions(categoryExercises);
        const interpretationPatterns = this.analyzeInterpretations(categoryExercises);
        const realityCheckImpact = this.analyzeRealityCheckImpact(categoryExercises);
        const weeklyPatternJourney = this.buildWeeklyPatternJourney(categoryExercises);
        const assumptionFactProfile = this.analyzeAssumptionFactProfile(categoryExercises);
        const triggerResponseMap = this.buildTriggerResponseMap(categoryExercises);
        const recommendedActions = this.generateActionRecommendations(
            interpretationPatterns,
            assumptionFactProfile,
            realityCheckImpact
        );
        const insight = this.generateInsight(category, categoryExercises, emotionalPatterns, interpretationPatterns);

        return {
            category,
            timeframe,
            whatHappened,
            emotionalPatterns,
            interpretationPatterns,
            realityCheckImpact,
            weeklyPatternJourney,
            assumptionFactProfile,
            triggerResponseMap,
            recommendedActions,
            insight,
            exerciseCount: categoryExercises.length
        };
    }

    /**
     * Get count of exercises in last 30 days
     */
    getTimeframeCount(exercises) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return exercises.filter(ex => {
            return new Date(ex.createdAt) >= thirtyDaysAgo;
        }).length;
    }

    /**
     * Extract "What Happened" themes
     */
    extractWhatHappened(exercises) {
        const themes = {};

        exercises.forEach(ex => {
            const text = (ex.event + ' ' + ex.interpretation).toLowerCase();
            Object.keys(this.themeKeywords).forEach(theme => {
                if (this.themeKeywords[theme].some(kw => text.includes(kw))) {
                    themes[theme] = (themes[theme] || 0) + 1;
                }
            });
        });

        // Convert to array and format
        return Object.entries(themes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([theme, count]) => ({
                theme: this.formatThemeName(theme),
                count: count
            }));
    }

    /**
     * Build week-by-week pattern journey metrics for trend view
     */
    buildWeeklyPatternJourney(exercises) {
        const sorted = [...exercises].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const weekly = {};

        sorted.forEach(ex => {
            const weekStart = this.getWeekStartKey(ex.createdAt);
            if (!weekly[weekStart]) {
                weekly[weekStart] = {
                    count: 0,
                    assumptionTotal: 0,
                    factTotal: 0,
                    confidenceShiftTotal: 0,
                    confidenceShiftCount: 0,
                    emotions: {}
                };
            }

            const assumptionScore = this.scoreMarkers(ex.interpretation || '', this.assumptionMarkers);
            const factScore = this.scoreMarkers(`${ex.event || ''} ${ex.reflection || ''}`, this.factMarkers);
            weekly[weekStart].count++;
            weekly[weekStart].assumptionTotal += assumptionScore;
            weekly[weekStart].factTotal += factScore;

            if (ex.reflection && ex.reflection.trim()) {
                const before = this.getConfidenceBefore(ex);
                const after = this.getConfidenceAfter(ex);
                weekly[weekStart].confidenceShiftTotal += Math.max(0, before - after);
                weekly[weekStart].confidenceShiftCount++;
            }

            this.parseEmotionTokens(ex.emotion || '').forEach(token => {
                weekly[weekStart].emotions[token] = (weekly[weekStart].emotions[token] || 0) + 1;
            });
        });

        const trend = Object.entries(weekly)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .slice(-8)
            .map(([weekStart, data]) => {
                const evidenceTotal = data.assumptionTotal + data.factTotal;
                const assumptionPercent = evidenceTotal > 0
                    ? Math.round((data.assumptionTotal / evidenceTotal) * 100)
                    : 50;
                const factPercent = 100 - assumptionPercent;
                const avgShift = data.confidenceShiftCount > 0
                    ? Math.round(data.confidenceShiftTotal / data.confidenceShiftCount)
                    : 0;

                return {
                    weekStart,
                    label: this.formatWeekLabel(weekStart),
                    exerciseCount: data.count,
                    assumptionPercent,
                    factPercent,
                    averageShift: avgShift,
                    dominantEmotion: this.getDominantEmotion(data.emotions)
                };
            });

        const currentWeek = trend[trend.length - 1] || null;
        const previousWeek = trend[trend.length - 2] || null;

        return {
            trend,
            currentWeek,
            momentum: this.getMomentum(currentWeek, previousWeek)
        };
    }

    /**
     * Analyze whether thought records are assumption-heavy or fact-grounded
     */
    analyzeAssumptionFactProfile(exercises) {
        let assumptionHeavy = 0;
        let factGrounded = 0;
        let balanced = 0;

        exercises.forEach(ex => {
            const assumptionScore = this.scoreMarkers(ex.interpretation || '', this.assumptionMarkers);
            const factScore = this.scoreMarkers(`${ex.event || ''} ${ex.reflection || ''}`, this.factMarkers);

            if (assumptionScore > factScore + 1) {
                assumptionHeavy++;
            } else if (factScore > assumptionScore + 1) {
                factGrounded++;
            } else {
                balanced++;
            }
        });

        const total = Math.max(1, exercises.length);
        const assumptionPct = Math.round((assumptionHeavy / total) * 100);
        const factPct = Math.round((factGrounded / total) * 100);
        const balancedPct = Math.max(0, 100 - assumptionPct - factPct);

        return {
            assumptionHeavy,
            factGrounded,
            balanced,
            assumptionPct,
            factPct,
            balancedPct,
            narrative: this.buildAssumptionFactNarrative(assumptionPct, factPct, balancedPct)
        };
    }

    /**
     * Build trigger -> emotion -> reaction mapping
     */
    buildTriggerResponseMap(exercises) {
        const bucket = {};

        exercises.forEach(ex => {
            const theme = this.detectPrimaryTheme(ex);
            if (!bucket[theme]) {
                bucket[theme] = {
                    count: 0,
                    emotions: {},
                    patterns: {}
                };
            }

            bucket[theme].count++;

            this.parseEmotionTokens(ex.emotion || '').forEach(token => {
                bucket[theme].emotions[token] = (bucket[theme].emotions[token] || 0) + 1;
            });

            const topPattern = this.getTopInterpretationPattern(ex.interpretation || '');
            if (topPattern) {
                bucket[theme].patterns[topPattern] = (bucket[theme].patterns[topPattern] || 0) + 1;
            }
        });

        return Object.entries(bucket)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([theme, data]) => ({
                theme: this.formatThemeName(theme),
                count: data.count,
                dominantEmotion: this.getDominantEmotion(data.emotions),
                dominantReaction: this.getDominantReaction(data.patterns)
            }));
    }

    /**
     * Generate concrete next actions from pattern profile
     */
    generateActionRecommendations(interpretationPatterns, assumptionFactProfile, realityCheckImpact) {
        const actions = [];

        if (assumptionFactProfile.assumptionPct >= 55) {
            actions.push('Pause before concluding: write 2 observable facts and 2 assumptions for each trigger event.');
        }

        const topPattern = interpretationPatterns && interpretationPatterns.length > 0
            ? interpretationPatterns[0].pattern.toLowerCase()
            : '';

        if (topPattern.includes('catastroph')) {
            actions.push('Use a best-case / likely-case / worst-case check once daily to reduce catastrophic forecasting.');
        }

        if (topPattern.includes('mind reading')) {
            actions.push('Replace mind-reading with verification: ask one clarifying question before interpreting intent.');
        }

        if (realityCheckImpact.impact < 10) {
            actions.push('Increase reflection depth: end each CBT entry with one small action you can do within 24 hours.');
        } else {
            actions.push('Keep your weekly momentum: repeat the reframing style that lowered confidence in negative predictions.');
        }

        if (actions.length < 3) {
            actions.push('Create a weekly review habit: compare this week\'s top emotion and reaction pattern with last week.');
        }

        return actions.slice(0, 4);
    }

    /**
     * Heuristic scoring for marker lists
     */
    scoreMarkers(text, markers) {
        const normalized = (text || '').toLowerCase();
        return markers.reduce((score, marker) => score + (normalized.includes(marker) ? 1 : 0), 0);
    }

    /**
     * Parse emotion field into normalized tokens
     */
    parseEmotionTokens(emotionText) {
        return (emotionText || '')
            .toLowerCase()
            .split(/,|;| and |\.|\//)
            .map(token => token.trim())
            .filter(Boolean)
            .slice(0, 6);
    }

    /**
     * Get Monday-start week key from date
     */
    getWeekStartKey(dateString) {
        const d = new Date(dateString);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() + diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart.toISOString();
    }

    /**
     * Format week label for chart rows
     */
    formatWeekLabel(weekStartIso) {
        const date = new Date(weekStartIso);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /**
     * Get dominant emotion label from count map
     */
    getDominantEmotion(emotionCounts) {
        const entries = Object.entries(emotionCounts || {});
        if (entries.length === 0) {
            return 'N/A';
        }
        const top = entries.sort((a, b) => b[1] - a[1])[0][0];
        return this.capitalizeFirst(top);
    }

    /**
     * Convert reaction map into display label
     */
    getDominantReaction(reactionCounts) {
        const entries = Object.entries(reactionCounts || {});
        if (entries.length === 0) {
            return 'No clear reaction yet';
        }
        return this.formatPatternName(entries.sort((a, b) => b[1] - a[1])[0][0]);
    }

    /**
     * Estimate momentum from consecutive weeks
     */
    getMomentum(currentWeek, previousWeek) {
        if (!currentWeek || !previousWeek) {
            return 'Building baseline';
        }

        const assumptionDrop = previousWeek.assumptionPercent - currentWeek.assumptionPercent;
        const shiftGain = currentWeek.averageShift - previousWeek.averageShift;

        if (assumptionDrop >= 8 || shiftGain >= 8) {
            return 'Strong improvement';
        }

        if (assumptionDrop >= 3 || shiftGain >= 3) {
            return 'Steady improvement';
        }

        if (assumptionDrop <= -5) {
            return 'Watch assumptions this week';
        }

        return 'Stable trend';
    }

    /**
     * Build narrative for assumption vs fact profile
     */
    buildAssumptionFactNarrative(assumptionPct, factPct, balancedPct) {
        if (assumptionPct >= 60) {
            return `Your recent entries lean assumption-heavy (${assumptionPct}%). Start with observable facts before interpretation.`;
        }

        if (factPct >= 50) {
            return `Great progress: ${factPct}% of entries are fact-grounded. Keep this pattern and add clearer next-step actions.`;
        }

        return `You are in transition: ${balancedPct}% of entries show mixed evidence. Weekly review will help improve consistency.`;
    }

    /**
     * Pick one best-matching theme for an exercise
     */
    detectPrimaryTheme(exercise) {
        const text = `${exercise.event || ''} ${exercise.interpretation || ''}`.toLowerCase();
        let bestTheme = 'miscommunication';
        let bestScore = 0;

        Object.entries(this.themeKeywords).forEach(([theme, keywords]) => {
            const score = keywords.reduce((sum, kw) => sum + (text.includes(kw) ? 1 : 0), 0);
            if (score > bestScore) {
                bestTheme = theme;
                bestScore = score;
            }
        });

        return bestTheme;
    }

    /**
     * Detect most likely interpretation pattern for one exercise
     */
    getTopInterpretationPattern(interpretation) {
        const text = (interpretation || '').toLowerCase();
        const candidates = {
            catastrophizing: ['ruined', 'disaster', 'worst', 'terrible', 'will fail'],
            mind_reading: ['they think', 'judging', 'negative about me'],
            predicting_failure: ['won\'t work', 'won\'t succeed', 'will go wrong'],
            personalization: ['my fault', 'because of me', 'i caused'],
            assuming_exclusion: ['left out', 'excluded', 'not included'],
            overgeneralization: ['always', 'never', 'every time']
        };

        let topPattern = '';
        let topScore = 0;

        Object.entries(candidates).forEach(([pattern, words]) => {
            const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
            if (score > topScore) {
                topScore = score;
                topPattern = pattern;
            }
        });

        return topPattern;
    }

    /**
     * Format theme name for display
     */
    formatThemeName(theme) {
        const names = {
            'delayed_response': 'Delayed responses',
            'feedback_discussion': 'Feedback discussions',
            'disagreement': 'Disagreement in meetings',
            'miscommunication': 'Miscommunication',
            'performance_concern': 'Performance concerns',
            'social_pressure': 'Social pressure/observation',
            'rejection': 'Fear of exclusion'
        };
        return names[theme] || theme;
    }

    /**
     * Analyze emotional patterns
     */
    analyzeEmotions(exercises) {
        const emotions = {};

        exercises.forEach(ex => {
            const emotionList = ex.emotion.split(/[,;]/);
            emotionList.forEach(e => {
                const emotion = e.trim().toLowerCase();
                if (emotion) {
                    emotions[emotion] = (emotions[emotion] || 0) + 1;
                }
            });
        });

        const total = Object.values(emotions).reduce((a, b) => a + b, 0);
        const sorted = Object.entries(emotions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return sorted.map(([emotion, count]) => ({
            emotion: this.capitalizeFirst(emotion),
            count: count,
            percentage: Math.round((count / total) * 100)
        }));
    }

    /**
     * Analyze interpretation patterns (cognitive distortions)
     */
    analyzeInterpretations(exercises) {
        const patterns = {
            'catastrophizing': { keywords: ['will fail', 'ruined', 'never', 'worst', 'disaster', 'terrible'], count: 0, examples: [] },
            'mind_reading': { keywords: ['think i', 'they think', 'judging', 'judged', 'negative about me'], count: 0, examples: [] },
            'predicting_failure': { keywords: ['won\'t work', 'won\'t succeed', 'will go wrong', 'will fail', 'predict'], count: 0, examples: [] },
            'personalization': { keywords: ['my fault', 'because of me', 'my problem', 'i caused', 'responsible'], count: 0, examples: [] },
            'assuming_exclusion': { keywords: ['left out', 'excluded', 'not included', 'alone', 'nobody wants'], count: 0, examples: [] },
            'overgeneralization': { keywords: ['always', 'never', 'never again', 'ruined everything'], count: 0, examples: [] }
        };

        exercises.forEach(ex => {
            const text = ex.interpretation.toLowerCase();
            const originalText = ex.interpretation;
            Object.keys(patterns).forEach(pattern => {
                patterns[pattern].keywords.forEach(kw => {
                    if (text.includes(kw)) {
                        patterns[pattern].count++;
                        // Add example if we don't have too many
                        if (patterns[pattern].examples.length < 3 && !patterns[pattern].examples.includes(originalText)) {
                            patterns[pattern].examples.push(originalText);
                        }
                    }
                });
            });
        });

        return Object.entries(patterns)
            .map(([pattern, data]) => ({
                pattern: this.formatPatternName(pattern),
                occurrences: data.count,
                examples: data.examples
            }))
            .filter(p => p.occurrences > 0)
            .sort((a, b) => b.occurrences - a.occurrences)
            .slice(0, 6);
    }

    /**
     * Format pattern name for display
     */
    formatPatternName(pattern) {
        const names = {
            'catastrophizing': 'Catastrophizing',
            'mind_reading': 'Mind reading',
            'predicting_failure': 'Predicting poor outcomes',
            'personalization': 'Taking events personally',
            'assuming_exclusion': 'Assuming exclusion',
            'overgeneralization': 'Overgeneralization'
        };
        return names[pattern] || pattern;
    }

    /**
     * Analyze reality check impact
     */
    analyzeRealityCheckImpact(exercises) {
        let beforeTotal = 0;
        let beforeCount = 0;
        let afterTotal = 0;
        let afterCount = 0;

        exercises.forEach(ex => {
            if (ex.realities && ex.realities.length > 0 && ex.reflection) {
                // Before: measure confidence in initial interpretation
                const beforeConfidence = this.getConfidenceBefore(ex);
                beforeTotal += beforeConfidence;
                beforeCount++;

                // After: measure confidence shift based on reflection
                const afterConfidence = this.getConfidenceAfter(ex);
                afterTotal += afterConfidence;
                afterCount++;
            }
        });

        const beforeAvg = beforeCount > 0 ? Math.round(beforeTotal / beforeCount) : 0;
        const afterAvg = afterCount > 0 ? Math.round(afterTotal / afterCount) : 0;
        const impact = beforeAvg - afterAvg;

        return {
            beforeAverage: beforeAvg,
            afterAverage: afterAvg,
            impact: impact,
            exercisesWithReflection: afterCount
        };
    }

    /**
     * Calculate confidence in interpretation (higher = more certain)
     */
    calculateConfidence(interpretation) {
        const certaintyWords = ['will', 'definitely', 'definitely will', 'absolutely', 'no doubt', 'for sure'];
        const uncertaintyWords = ['might', 'maybe', 'could', 'possibly', 'probably', 'perhaps'];

        const text = interpretation.toLowerCase();
        let confidence = 50; // baseline

        certaintyWords.forEach(word => {
            if (text.includes(word)) confidence += 10;
        });

        uncertaintyWords.forEach(word => {
            if (text.includes(word)) confidence -= 10;
        });

        return Math.min(100, Math.max(10, confidence));
    }

    /**
     * Calculate confidence after reflection (shift towards uncertainty)
     */
    calculateConfidenceShift(reflection) {
        const reflectionWords = [
            'maybe', 'could', 'possibly', 'different', 'alternative',
            'wasn\'t', 'not as bad', 'overreacted', 'exaggerated',
            'realize', 'understand', 'see', 'perspective'
        ];

        const text = reflection.toLowerCase();
        let newConfidence = 70; // baseline after reflection

        reflectionWords.forEach(word => {
            if (text.includes(word)) newConfidence -= 5;
        });

        return Math.max(20, newConfidence);
    }

    /**
     * Get confidence before reframing from explicit value or text heuristic
     */
    getConfidenceBefore(exercise) {
        if (Number.isFinite(exercise?.confidenceBefore)) {
            return Math.min(100, Math.max(10, Number(exercise.confidenceBefore)));
        }
        return this.calculateConfidence(exercise?.interpretation || '');
    }

    /**
     * Get confidence after reframing from explicit value or text heuristic
     */
    getConfidenceAfter(exercise) {
        if (Number.isFinite(exercise?.confidenceAfter)) {
            return Math.min(100, Math.max(10, Number(exercise.confidenceAfter)));
        }
        return this.calculateConfidenceShift(exercise?.reflection || '');
    }

    /**
     * Generate AI insight about the pattern
     */
    generateInsight(category, exercises, emotionalPatterns, interpretationPatterns) {
        const insights = {
            'Workplace Pattern Insights': [
                'Workplace uncertainty appears to trigger concern about how others perceive your performance. In many situations, later information suggested alternative explanations were equally or more likely.',
                'You tend to interpret workplace feedback as more critical than intended. Reality checks revealed that colleagues often have constructive intentions even when delivery feels harsh.',
                'Anxiety about performance seems to amplify your interpretation of neutral feedback. Once you examined alternative explanations, many situations seemed less threatening.',
                'Your workplace interpretations often assume the worst-case scenario. By exploring other perspectives, you\'ve discovered that most situations have more neutral outcomes.'
            ],
            'Relationship Pattern Insights': [
                'In relationships, you tend to assume negative judgments from others. Reality checks helped you see that people are often more accepting than you feared.',
                'Relationship anxiety appears to drive interpretations of avoidance or rejection. Examining alternative explanations revealed misunderstandings rather than intentional distance.',
                'You frequently interpret ambiguous actions in relationships negatively. When you challenged these thoughts, you found more neutral or positive explanations.',
                'Communication gaps in relationships often trigger assumptions of conflict. Reality checks showed that clarification usually reveals misunderstandings, not actual problems.'
            ],
            'Social Situation Insights': [
                'Social situations trigger heightened worry about judgment. Reality checks revealed that others are typically focused on themselves rather than evaluating you.',
                'You tend to overestimate how much others notice or care about your behavior in social settings. Alternative perspectives showed that most people are less judgmental than you assume.',
                'Social anxiety leads to interpretations of rejection or exclusion that reality checks often disprove. Most situations turned out to be neutral or positive.',
                'In group settings, you assume negative judgments about yourself. Examining these thoughts revealed that others\' reactions are usually about their own concerns, not your behavior.'
            ],
            'General Insights': [
                'Your pattern shows a tendency toward anticipating negative outcomes. Reality checks have helped you develop more balanced thinking about uncertain situations.',
                'You frequently interpret ambiguous situations negatively. By exploring alternatives, you\'ve discovered that neutral or positive explanations are often equally likely.',
                'Your interpretations tend to assume personal threat or failure. Reality checks revealed that many situations are either neutral or have solutions you hadn\'t considered.',
                'You show a pattern of mind-reading where you assume others have negative thoughts about you. Alternative perspectives helped you see that this assumption is often unfounded.'
            ]
        };

        const categoryInsights = insights[category] || insights['General Insights'];
        const randomIndex = Math.floor(Math.random() * categoryInsights.length);
        return categoryInsights[randomIndex];
    }

    /**
     * Get all categories with data
     */
    getAllCategoriesWithData(exercises) {
        const results = {};

        this.categories.forEach(category => {
            const analysis = this.analyzeCategory(category, exercises);
            if (analysis) {
                results[category] = analysis;
            }
        });

        return results;
    }

    /**
     * Helper: capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get statistics summary
     */
    getStatisticsSummary(exercises) {
        const stats = {
            totalExercises: exercises.length,
            exercisesLast30Days: this.getTimeframeCount(exercises),
            exercisesWithReflection: exercises.filter(e => e.reflection && e.reflection.trim()).length,
            averageConfidenceShift: this.calculateAverageConfidenceShift(exercises),
            mostCommonCategory: this.getMostCommonCategory(exercises)
        };

        return stats;
    }

    /**
     * Calculate average confidence shift
     */
    calculateAverageConfidenceShift(exercises) {
        let total = 0;
        let count = 0;

        exercises.forEach(ex => {
            if (ex.realities && ex.realities.length > 0 && ex.reflection) {
                const before = this.getConfidenceBefore(ex);
                const after = this.getConfidenceAfter(ex);
                total += (before - after);
                count++;
            }
        });

        return count > 0 ? Math.round(total / count) : 0;
    }

    /**
     * Get most common category
     */
    getMostCommonCategory(exercises) {
        const categoryCounts = {};

        exercises.forEach(ex => {
            const category = this.categorizeExercise(ex);
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        let maxCategory = 'General Insights';
        let maxCount = 0;

        Object.entries(categoryCounts).forEach(([category, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxCategory = category;
            }
        });

        return maxCategory;
    }

    /**
     * Calculate emotional awareness progress over time
     */
    calculateEmotionalAwarenessProgress(exercises) {
        if (exercises.length < 3) return null;

        // Group exercises by month
        const monthlyData = {};
        exercises.forEach(ex => {
            const date = new Date(ex.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { total: 0, withEmotions: 0 };
            }
            
            monthlyData[monthKey].total++;
            // Count emotion identification (more detailed emotions = better awareness)
            if (ex.emotion && ex.emotion.length > 5) {
                monthlyData[monthKey].withEmotions++;
            }
        });

        const timeline = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            percentage: Math.round((data.withEmotions / data.total) * 100)
        }));

        return {
            timeline,
            improvement: timeline.length > 1 
                ? timeline[timeline.length - 1].percentage - timeline[0].percentage
                : 0,
            currentScore: timeline.length > 0 ? timeline[timeline.length - 1].percentage : 0
        };
    }

    /**
     * Calculate flexibility score progress (confidence shift)
     */
    calculateFlexibilityProgress(exercises) {
        if (exercises.length < 3) return null;

        // Group exercises by month
        const monthlyData = {};
        exercises.forEach(ex => {
            if (!ex.reflection || ex.reflection.length === 0) return;
            
            const date = new Date(ex.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { shifts: [] };
            }
            
            const before = this.getConfidenceBefore(ex);
            const after = this.getConfidenceAfter(ex);
            const shift = Math.abs(before - after);
            monthlyData[monthKey].shifts.push({ before, after, shift });
        });

        const timeline = Object.entries(monthlyData).map(([month, data]) => {
            const avgShift = data.shifts.length > 0 
                ? Math.round(data.shifts.reduce((sum, s) => sum + s.shift, 0) / data.shifts.length)
                : 0;
            const avgBefore = data.shifts.length > 0
                ? Math.round(data.shifts.reduce((sum, s) => sum + s.before, 0) / data.shifts.length)
                : 0;
            const avgAfter = data.shifts.length > 0
                ? Math.round(data.shifts.reduce((sum, s) => sum + s.after, 0) / data.shifts.length)
                : 0;

            return {
                month,
                before: avgBefore,
                after: avgAfter,
                shift: avgShift
            };
        });

        return {
            timeline,
            improvement: timeline.length > 1 
                ? timeline[timeline.length - 1].shift - timeline[0].shift
                : 0,
            currentScore: timeline.length > 0 ? timeline[timeline.length - 1].shift : 0
        };
    }

    /**
     * Calculate reaction speed progress (how quickly to alternatives)
     */
    calculateReactionSpeedProgress(exercises) {
        if (exercises.length < 3) return null;

        // Group exercises by month
        const monthlyData = {};
        exercises.forEach(ex => {
            const date = new Date(ex.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { exercises: [] };
            }
            
            monthlyData[monthKey].exercises.push(ex);
        });

        const timeline = Object.entries(monthlyData).map(([month, data]) => {
            // Measure: exercises that moved to alternatives quickly
            const quickAlternatives = data.exercises.filter(ex => {
                if (!ex.realities || ex.realities.length === 0) return false;
                // Quick reaction = has multiple realities and reflection
                return ex.realities.length >= 2 && ex.reflection && ex.reflection.length > 10;
            }).length;

            const score = Math.round((quickAlternatives / data.exercises.length) * 100);
            return {
                month,
                score
            };
        });

        return {
            timeline,
            improvement: timeline.length > 1
                ? timeline[timeline.length - 1].score - timeline[0].score
                : 0,
            currentScore: timeline.length > 0 ? timeline[timeline.length - 1].score : 0
        };
    }

    /**
     * Generate progress insight for emotional awareness
     */
    generateEmotionalAwarenessInsight(progress) {
        if (!progress) return '';
        
        const { improvement, currentScore } = progress;
        
        if (currentScore >= 80) {
            return `You have become significantly more precise at identifying emotions. Your current awareness score of ${currentScore}% shows you're developing sophisticated emotional literacy.`;
        } else if (improvement > 30) {
            return `Great progress! You've improved your emotional awareness by ${improvement} percentage points. You're becoming better at recognizing nuanced feelings.`;
        } else if (improvement > 0) {
            return `You're making steady progress in identifying emotions. Keep practicing naming specific feelings—it becomes easier with time.`;
        } else {
            return `Focus on identifying specific emotions beyond the basics. Try using emotion wheels or charts to expand your emotional vocabulary.`;
        }
    }

    /**
     * Generate progress insight for flexibility score
     */
    generateFlexibilityInsight(progress) {
        if (!progress) return '';
        
        const { currentScore, improvement } = progress;
        
        if (currentScore >= 30) {
            return `Excellent! You've become increasingly willing to consider multiple explanations. Your flexibility score of ${currentScore}% shows strong growth in entertaining alternative perspectives before settling on conclusions.`;
        } else if (improvement > 15) {
            return `Your flexibility is improving! You've increased your ability to consider alternatives by ${improvement} percentage points. You're thinking more flexibly about situations.`;
        } else if (currentScore > 10) {
            return `You're developing the ability to pause and consider alternatives. Keep practicing exploring multiple perspectives before accepting your first interpretation.`;
        } else {
            return `Try to practice considering at least 2-3 alternative explanations for situations before deciding. This is a key skill you're building.`;
        }
    }

    /**
     * Generate progress insight for reaction speed
     */
    generateReactionSpeedInsight(progress) {
        if (!progress) return '';
        
        const { currentScore, improvement } = progress;
        
        if (currentScore >= 70) {
            return `Excellent progress! You now generate alternative explanations with less prompting. ${currentScore}% of your recent exercises show rapid movement to exploring multiple perspectives.`;
        } else if (improvement > 30) {
            return `Great improvement! Compared with earlier, you're generating alternatives ${improvement} percentage points faster. You've internalized the habit of questioning assumptions.`;
        } else if (improvement > 0) {
            return `You're gradually becoming faster at moving from assumptions to alternatives. With more practice, this process will become more automatic.`;
        } else {
            return `Keep using the app consistently. The more you practice, the faster you'll naturally move from initial assumptions to exploring alternatives.`;
        }
    }

    /**
     * Get all progress metrics
     */
    getProgressMetrics(exercises) {
        const emotionalAwareness = this.calculateEmotionalAwarenessProgress(exercises);
        const flexibility = this.calculateFlexibilityProgress(exercises);
        const reactionSpeed = this.calculateReactionSpeedProgress(exercises);

        return {
            emotionalAwareness: emotionalAwareness ? {
                ...emotionalAwareness,
                insight: this.generateEmotionalAwarenessInsight(emotionalAwareness)
            } : null,
            flexibility: flexibility ? {
                ...flexibility,
                insight: this.generateFlexibilityInsight(flexibility)
            } : null,
            reactionSpeed: reactionSpeed ? {
                ...reactionSpeed,
                insight: this.generateReactionSpeedInsight(reactionSpeed)
            } : null,
            hasData: emotionalAwareness || flexibility || reactionSpeed
        };
    }
}

// Create global instance
const patternAnalytics = new PatternAnalytics();
