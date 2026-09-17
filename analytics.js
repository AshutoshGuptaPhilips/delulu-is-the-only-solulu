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
        const insight = this.generateInsight(category, categoryExercises, emotionalPatterns, interpretationPatterns);

        return {
            category,
            timeframe,
            whatHappened,
            emotionalPatterns,
            interpretationPatterns,
            realityCheckImpact,
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
        const keywords = {
            'delayed_response': ['late', 'slow', 'delayed', 'didn\'t respond', 'no reply'],
            'feedback_discussion': ['feedback', 'criticism', 'comment', 'review', 'critique'],
            'disagreement': ['disagree', 'argue', 'conflict', 'different opinion', 'opposed'],
            'miscommunication': ['misunderstood', 'confusion', 'unclear', 'mixed message'],
            'performance_concern': ['mistake', 'error', 'fail', 'not good enough', 'incompetent'],
            'social_pressure': ['judge', 'watch', 'observe', 'stare', 'attention'],
            'rejection': ['ignore', 'exclude', 'left out', 'rejected', 'not invited']
        };

        exercises.forEach(ex => {
            const text = (ex.event + ' ' + ex.interpretation).toLowerCase();
            Object.keys(keywords).forEach(theme => {
                if (keywords[theme].some(kw => text.includes(kw))) {
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
                const beforeConfidence = this.calculateConfidence(ex.interpretation);
                beforeTotal += beforeConfidence;
                beforeCount++;

                // After: measure confidence shift based on reflection
                const afterConfidence = this.calculateConfidenceShift(ex.reflection);
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
                const before = this.calculateConfidence(ex.interpretation);
                const after = this.calculateConfidenceShift(ex.reflection);
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
            
            const before = this.calculateConfidence(ex.interpretation);
            const after = this.calculateConfidenceShift(ex.reflection);
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
