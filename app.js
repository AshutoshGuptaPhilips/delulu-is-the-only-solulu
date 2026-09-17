/* ============================================
   SOLULU - Main Application
   Core application logic and UI interactions
   ============================================ */

class SoluluApp {
    constructor() {
        this.currentExercise = null;
        this.allExercises = [];
        this.isGenerating = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.cacheElements();

        const seedResult = await dataManager.seedExercisesFromDatasets();

        this.loadCurrentExercise();
        this.attachEventListeners();
        this.setupCharacterCounters();

        if (seedResult.seeded) {
            this.showToast(`${seedResult.count} exercises loaded`, 'success');
        }

        this.showToast('Welcome to Solulu! 🌟', 'info');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        // Input elements
        this.eventInput = document.getElementById('eventInput');
        this.emotionInput = document.getElementById('emotionInput');
        this.interpretationInput = document.getElementById('interpretationInput');
        this.reflectionInput = document.getElementById('reflectionInput');

        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.viewAllBtn = document.getElementById('viewAllBtn');
        this.reflectionToggle = document.getElementById('reflectionToggle');
        this.backBtn = document.getElementById('backBtn');
        this.saveReflectionBtn = document.getElementById('saveReflectionBtn');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');
        this.newExerciseBtn = document.getElementById('newExerciseBtn');

        // Section elements
        this.outputSection = document.getElementById('outputSection');
        this.realitiesContainer = document.getElementById('realitiesContainer');
        this.reflectionContent = document.getElementById('reflectionContent');
        this.reflectionHeader = document.getElementById('reflectionHeader');

        // Modal elements
        this.exercisesModal = document.getElementById('exercisesModal');
        this.exercisesList = document.getElementById('exercisesList');
        this.emptyState = document.getElementById('emptyState');

        // Search and filter
        this.searchInput = document.getElementById('searchInput');
        this.filterSelect = document.getElementById('filterSelect');

        // Tab navigation
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Pattern Insights elements
        this.insightsOverview = document.getElementById('insightsOverview');
        this.insightsEmptyState = document.getElementById('insightsEmptyState');
        this.insightsCategories = document.getElementById('insightsCategories');
        this.insightsDisplay = document.getElementById('insightsDisplay');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.patternsList = document.getElementById('patternsList');

        // Progress elements
        this.progressContainer = document.getElementById('progressContainer');
        this.progressEmptyState = document.getElementById('progressEmptyState');
        this.emotionalAwarenessMetrics = document.getElementById('emotionalAwarenessMetrics');
        this.emotionalAwarenessInsight = document.getElementById('emotionalAwarenessInsight');
        this.flexibilityMetrics = document.getElementById('flexibilityMetrics');
        this.flexibilityInsight = document.getElementById('flexibilityInsight');
        this.reactionSpeedMetrics = document.getElementById('reactionSpeedMetrics');
        this.reactionSpeedInsight = document.getElementById('reactionSpeedInsight');
        this.summaryStats = document.getElementById('summaryStats');

        // Other elements
        this.exerciseTitle = document.getElementById('exerciseTitle');
        this.exerciseTimestamp = document.getElementById('exerciseTimestamp');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toastContainer = document.getElementById('toastContainer');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Input events
        this.eventInput?.addEventListener('input', () => this.updateCharCount('eventInput', 'eventCount'));
        this.emotionInput?.addEventListener('input', () => this.updateCharCount('emotionInput', 'emotionCount'));
        this.interpretationInput?.addEventListener('input', () => this.updateCharCount('interpretationInput', 'interpretationCount'));
        this.reflectionInput?.addEventListener('input', () => this.updateCharCount('reflectionInput', 'reflectionCount'));

        // Button events
        this.generateBtn?.addEventListener('click', () => this.handleGenerate());
        this.viewAllBtn?.addEventListener('click', () => this.openExercisesModal());
        this.reflectionToggle?.addEventListener('click', () => this.toggleReflection());
        this.backBtn?.addEventListener('click', () => this.handleBackToList());
        this.saveReflectionBtn?.addEventListener('click', () => this.saveReflection());
        this.modalCloseBtn?.addEventListener('click', () => this.closeExercisesModal());
        this.newExerciseBtn?.addEventListener('click', () => this.createNewExercise());

        // Search and filter
        this.searchInput?.addEventListener('input', () => this.filterExercises());
        this.filterSelect?.addEventListener('change', () => this.filterExercises());

        // Tab navigation
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.currentTarget));
        });

        // Pattern Insights category selection
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategorySelect(e.currentTarget));
        });

        // Modal click outside
        this.exercisesModal?.addEventListener('click', (e) => {
            if (e.target === this.exercisesModal) {
                this.closeExercisesModal();
            }
        });

        // Auto-save on input
        [this.eventInput, this.emotionInput, this.interpretationInput].forEach(input => {
            input?.addEventListener('change', () => this.autoSaveExercise());
        });

        // Prevent losing data on page unload
        window.addEventListener('beforeunload', () => this.autoSaveExercise());
    }

    /**
     * Setup character counters
     */
    setupCharacterCounters() {
        this.updateCharCount('eventInput', 'eventCount');
        this.updateCharCount('emotionInput', 'emotionCount');
        this.updateCharCount('interpretationInput', 'interpretationCount');
        this.updateCharCount('reflectionInput', 'reflectionCount');
    }

    /**
     * Update character count display
     */
    updateCharCount(inputId, countId) {
        const input = document.getElementById(inputId);
        const count = document.getElementById(countId);
        if (input && count) {
            count.textContent = input.value.length;
        }
    }

    /**
     * Load current exercise or create new one
     */
    loadCurrentExercise() {
        this.currentExercise = dataManager.getCurrentExercise();
        this.populateFormWithExercise();
        this.updateTimestamp();
        this.checkIfHasRealities();
    }

    /**
     * Populate form with exercise data
     */
    populateFormWithExercise() {
        if (this.currentExercise) {
            this.eventInput.value = this.currentExercise.event || '';
            this.emotionInput.value = this.currentExercise.emotion || '';
            this.interpretationInput.value = this.currentExercise.interpretation || '';
            this.reflectionInput.value = this.currentExercise.reflection || '';
            this.setupCharacterCounters();
        }
    }

    /**
     * Update exercise timestamp
     */
    updateTimestamp() {
        if (this.currentExercise) {
            const relative = dataManager.getRelativeTime(this.currentExercise.createdAt);
            this.exerciseTimestamp.textContent = `Started ${relative}`;
            this.exerciseTitle.textContent = this.currentExercise.event.substring(0, 50) || 'NEW EXERCISE';
        }
    }

    /**
     * Check if exercise has generated realities
     */
    checkIfHasRealities() {
        if (this.currentExercise?.realities && this.currentExercise.realities.length > 0) {
            this.displayRealities();
        } else {
            this.outputSection.style.display = 'none';
        }
    }

    /**
     * Handle generate button click
     */
    async handleGenerate() {
        const event = this.eventInput.value.trim();
        const emotion = this.emotionInput.value.trim();
        const interpretation = this.interpretationInput.value.trim();

        // Validate inputs
        const validation = aiReality.validateInputs(event, emotion, interpretation);
        if (!validation.valid) {
            validation.errors.forEach(error => {
                this.showToast(error, 'error');
            });
            return;
        }

        // Check if already generating
        if (this.isGenerating) {
            this.showToast('Already generating realities...', 'warning');
            return;
        }

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.generateBtn.classList.add('loading');
        this.loadingOverlay.style.display = 'flex';

        try {
            // Save current inputs
            this.autoSaveExercise();

            // Generate realities
            const realities = await aiReality.generateRealities(event, emotion, interpretation);

            // Save realities
            this.currentExercise = dataManager.updateExercise(this.currentExercise.id, {
                realities: realities,
                status: 'generated'
            });

            // Display realities
            this.displayRealities();
            this.outputSection.style.display = 'block';

            this.showToast('Alternate realities generated! ✨', 'success');
        } catch (error) {
            console.error('Error generating realities:', error);
            this.showToast('Failed to generate realities. Please try again.', 'error');
        } finally {
            this.isGenerating = false;
            this.generateBtn.disabled = false;
            this.generateBtn.classList.remove('loading');
            this.loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Display generated realities
     */
    displayRealities() {
        this.realitiesContainer.innerHTML = '';

        if (!this.currentExercise?.realities || this.currentExercise.realities.length === 0) {
            return;
        }

        this.currentExercise.realities.forEach((reality, index) => {
            const card = this.createRealityCard(reality, index);
            this.realitiesContainer.appendChild(card);
        });

        // Scroll to realities
        setTimeout(() => {
            this.realitiesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    /**
     * Create reality card element
     */
    createRealityCard(reality, index) {
        const card = document.createElement('div');
        card.className = `reality-card ${reality.isAIInterpretation ? 'ai-interpretation' : 'alternate'}`;

        const number = reality.id || (index + 1);
        const isAI = reality.isAIInterpretation || reality.type === 'ai_interpretation';

        card.innerHTML = `
            <div class="reality-header">
                <div class="reality-number">${number}</div>
                <div class="reality-title">${this.escapeHtml(reality.title)}</div>
            </div>
            <div class="reality-content">
                ${this.escapeHtml(reality.content).replace(/\n/g, '<br>')}
            </div>
            <div class="reality-actions">
                <button class="reality-btn copy" onclick="app.copyToClipboard('${this.escapeHtml(reality.content)}')">
                    📋 Copy
                </button>
                <button class="reality-btn" onclick="app.saveReality(${index})">
                    💾 Save
                </button>
                <button class="reality-btn" onclick="app.shareReality(${index})">
                    🔗 Share
                </button>
            </div>
        `;

        return card;
    }

    /**
     * Copy reality content to clipboard
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard! ✓', 'success');
        }).catch(() => {
            this.showToast('Failed to copy', 'error');
        });
    }

    /**
     * Save reality (placeholder for future)
     */
    saveReality(index) {
        this.showToast('Reality saved to your collection', 'success');
    }

    /**
     * Share reality (placeholder for future)
     */
    shareReality(index) {
        this.showToast('Share feature coming soon', 'info');
    }

    /**
     * Toggle reflection section
     */
    toggleReflection() {
        const isOpen = this.reflectionContent.style.display !== 'none';
        this.reflectionContent.style.display = isOpen ? 'none' : 'block';
        this.reflectionToggle.classList.toggle('open');
        this.reflectionToggle.querySelector('.toggle-text').textContent =
            isOpen ? 'Expand to Add Your Reflection' : 'Your Reflection';
    }

    /**
     * Save reflection
     */
    saveReflection() {
        const reflection = this.reflectionInput.value.trim();
        if (!reflection) {
            this.showToast('Please write a reflection', 'warning');
            return;
        }

        this.currentExercise = dataManager.updateExercise(this.currentExercise.id, {
            reflection: reflection,
            status: 'completed'
        });

        this.showToast('Reflection saved! 💭', 'success');
    }

    /**
     * Auto-save exercise
     */
    autoSaveExercise() {
        if (!this.currentExercise) return;

        const updates = {
            event: this.eventInput.value,
            emotion: this.emotionInput.value,
            interpretation: this.interpretationInput.value
        };

        this.currentExercise = dataManager.updateExercise(this.currentExercise.id, updates);
    }

    /**
     * Create new exercise
     */
    createNewExercise() {
        this.autoSaveExercise(); // Save current before creating new
        this.currentExercise = dataManager.createNewExercise();
        this.loadCurrentExercise();
        this.closeExercisesModal();
        this.showToast('New exercise created! 🎯', 'success');
    }

    /**
     * Handle back to list
     */
    handleBackToList() {
        this.autoSaveExercise();
        this.openExercisesModal();
    }

    /**
     * Open exercises modal
     */
    openExercisesModal() {
        this.exercisesModal.classList.add('active');

        if (this.searchInput) {
            this.searchInput.value = '';
        }
        if (this.filterSelect) {
            this.filterSelect.value = 'all';
        }

        this.loadExercisesList();
        document.body.classList.add('no-scroll');
    }

    /**
     * Close exercises modal
     */
    closeExercisesModal() {
        this.exercisesModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    /**
     * Load exercises list in modal
     */
    loadExercisesList() {
        this.allExercises = dataManager.getAllExercises();
        this.filterExercises();
    }

    /**
     * Filter exercises based on search and date filter
     */
    filterExercises() {
        const searchTerm = this.searchInput.value.trim();
        const filterType = this.filterSelect.value;

        let filtered = dataManager.getExercisesForDateRange(filterType);

        if (searchTerm) {
            filtered = filtered.filter(ex =>
                ex.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ex.emotion.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        this.displayExercisesList(filtered);
    }

    /**
     * Display exercises list
     */
    displayExercisesList(exercises) {
        this.exercisesList.innerHTML = '';

        if (exercises.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';

        // Group by date
        const grouped = this.groupExercisesByDate(exercises);

        Object.keys(grouped).forEach(dateGroup => {
            const groupExercises = grouped[dateGroup];
            const groupContainer = document.createElement('div');
            groupContainer.className = 'exercise-date-group';

            const label = document.createElement('div');
            label.className = 'exercise-date-label';
            label.textContent = dateGroup;
            groupContainer.appendChild(label);

            groupExercises.forEach(ex => {
                const item = this.createExerciseListItem(ex);
                groupContainer.appendChild(item);
            });

            this.exercisesList.appendChild(groupContainer);
        });
    }

    /**
     * Group exercises by date
     */
    groupExercisesByDate(exercises) {
        const grouped = {};

        exercises.forEach(ex => {
            const dateLabel = dataManager.formatDate(ex.createdAt);
            if (!grouped[dateLabel]) {
                grouped[dateLabel] = [];
            }
            grouped[dateLabel].push(ex);
        });

        return grouped;
    }

    /**
     * Create exercise list item element
     */
    createExerciseListItem(exercise) {
        const item = document.createElement('div');
        item.className = 'exercise-item';
        item.onclick = () => this.selectExercise(exercise.id);

        const time = dataManager.formatTime(exercise.createdAt);
        const status = exercise.reflection ? 'complete' : 'active';
        const statusText = exercise.reflection ? 'COMPLETE' : 'ACTIVE';
        const description = exercise.event.substring(0, 60) + (exercise.event.length > 60 ? '...' : '');

        item.innerHTML = `
            <div class="exercise-item-header">
                <div class="exercise-item-title">${this.escapeHtml(exercise.event || 'Untitled Exercise')}</div>
                <div class="exercise-item-time">Started ${time}</div>
                <div class="exercise-item-status ${status}">${statusText}</div>
            </div>
            <div class="exercise-item-description">${this.escapeHtml(description)}</div>
        `;

        return item;
    }

    /**
     * Select exercise from list
     */
    selectExercise(exerciseId) {
        this.autoSaveExercise();
        dataManager.setCurrentExerciseId(exerciseId);
        this.loadCurrentExercise();
        this.closeExercisesModal();
        this.showToast('Exercise loaded! 📖', 'success');
    }

    /**
     * Switch tab
     */
    switchTab(tabButton) {
        // Update active tab button
        this.navTabs.forEach(tab => tab.classList.remove('active'));
        tabButton.classList.add('active');

        // Update active tab content
        const tabName = tabButton.getAttribute('data-tab');
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName) {
                content.classList.add('active');

                // Load Pattern Insights when tab is opened
                if (tabName === 'pattern-insights') {
                    this.loadPatternInsights();
                }

                // Load Progress when tab is opened
                if (tabName === 'progress') {
                    this.loadProgress();
                }
            }
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        this.toastContainer.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Load and display pattern insights
     */
    loadPatternInsights() {
        this.allExercises = dataManager.getAllExercises();

        // Check if enough data
        const completedExercises = this.allExercises.filter(ex =>
            ex.realities && ex.realities.length > 0 && ex.reflection && ex.reflection.trim()
        );

        if (completedExercises.length < 3) {
            this.insightsEmptyState.style.display = 'block';
            this.insightsOverview.style.display = 'none';
            this.insightsCategories.style.display = 'none';
            this.insightsDisplay.style.display = 'none';
            return;
        }

        // Show categories
        this.insightsEmptyState.style.display = 'none';
        this.insightsCategories.style.display = 'block';
        this.insightsOverview.style.display = 'block';

        // Display overview stats
        this.displayInsightsOverview(this.allExercises);

        // Load first category by default
        this.handleCategorySelect(document.querySelector('[data-category="Workplace Pattern Insights"]'));
    }

    /**
     * Load and display progress metrics
     */
    loadProgress() {
        this.allExercises = dataManager.getAllExercises();

        // Check if enough data
        const completedExercises = this.allExercises.filter(ex =>
            ex.realities && ex.realities.length > 0 && ex.reflection && ex.reflection.trim()
        );

        if (completedExercises.length < 3) {
            this.progressEmptyState.style.display = 'flex';
            this.progressContainer.style.display = 'none';
            return;
        }

        // Get progress metrics
        const metrics = patternAnalytics.getProgressMetrics(this.allExercises);

        if (!metrics.hasData) {
            this.progressEmptyState.style.display = 'flex';
            this.progressContainer.style.display = 'none';
            return;
        }

        // Display progress
        this.progressEmptyState.style.display = 'none';
        this.progressContainer.style.display = 'flex';

        if (metrics.emotionalAwareness) {
            this.displayEmotionalAwarenessProgress(metrics.emotionalAwareness);
        }

        if (metrics.flexibility) {
            this.displayFlexibilityProgress(metrics.flexibility);
        }

        if (metrics.reactionSpeed) {
            this.displayReactionSpeedProgress(metrics.reactionSpeed);
        }

        // Display summary
        this.displayProgressSummary(metrics);
    }

    /**
     * Display emotional awareness progress
     */
    displayEmotionalAwarenessProgress(progress) {
        this.emotionalAwarenessMetrics.innerHTML = progress.timeline.map(item => `
            <div class="metric-row">
                <span class="metric-label">${this.formatMonthLabel(item.month)}</span>
                <div class="metric-values">
                    <div class="metric-value">
                        <span>${item.percentage}%</span>
                        <span class="metric-value-label">Awareness</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.emotionalAwarenessInsight.textContent = progress.insight;
    }

    /**
     * Display flexibility score progress
     */
    displayFlexibilityProgress(progress) {
        this.flexibilityMetrics.innerHTML = progress.timeline.map(item => `
            <div class="metric-row">
                <span class="metric-label">${this.formatMonthLabel(item.month)}</span>
                <div class="metric-values">
                    <div class="metric-value">
                        <span>${item.before}</span>
                        <span class="metric-value-label">Before</span>
                    </div>
                    <span class="metric-arrow">→</span>
                    <div class="metric-value">
                        <span>${item.after}</span>
                        <span class="metric-value-label">After</span>
                    </div>
                    <div class="metric-change">
                        <span class="metric-change-value">-${item.shift}</span>
                        <span class="metric-change-label">Shift</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.flexibilityInsight.textContent = progress.insight;
    }

    /**
     * Display reaction speed progress
     */
    displayReactionSpeedProgress(progress) {
        this.reactionSpeedMetrics.innerHTML = progress.timeline.map(item => `
            <div class="metric-row">
                <span class="metric-label">${this.formatMonthLabel(item.month)}</span>
                <div class="metric-values">
                    <div class="metric-value">
                        <span>${item.score}%</span>
                        <span class="metric-value-label">Speed Score</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.reactionSpeedInsight.textContent = progress.insight;
    }

    /**
     * Display progress summary
     */
    displayProgressSummary(metrics) {
        let summary = '';

        if (metrics.emotionalAwareness) {
            const improvement = metrics.emotionalAwareness.improvement;
            summary += `
                <div class="summary-stat">
                    <div class="summary-stat-value">${metrics.emotionalAwareness.currentScore}%</div>
                    <div class="summary-stat-label">Emotional Awareness</div>
                </div>
            `;
        }

        if (metrics.flexibility) {
            const shift = metrics.flexibility.currentScore;
            summary += `
                <div class="summary-stat">
                    <div class="summary-stat-value">-${shift}</div>
                    <div class="summary-stat-label">Flexibility Score</div>
                </div>
            `;
        }

        if (metrics.reactionSpeed) {
            const speed = metrics.reactionSpeed.currentScore;
            summary += `
                <div class="summary-stat">
                    <div class="summary-stat-value">${speed}%</div>
                    <div class="summary-stat-label">Reaction Speed</div>
                </div>
            `;
        }

        summary += `
            <div class="summary-stat">
                <div class="summary-stat-value">${this.allExercises.length}</div>
                <div class="summary-stat-label">Total Exercises</div>
            </div>
        `;

        this.summaryStats.innerHTML = summary;
    }

    /**
     * Format month label for display
     */
    formatMonthLabel(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }

    /**
     * Display overview statistics
     */
    displayInsightsOverview(exercises) {
        const stats = patternAnalytics.getStatisticsSummary(exercises);

        document.getElementById('totalExercises').textContent = stats.totalExercises;
        document.getElementById('exercisesLast30').textContent = stats.exercisesLast30Days;
        document.getElementById('withReflection').textContent = stats.exercisesWithReflection;
        document.getElementById('confidenceShift').textContent = stats.averageConfidenceShift + '%';
    }

    /**
     * Handle category button click
     */
    handleCategorySelect(btn) {
        if (!btn) return;

        const category = btn.getAttribute('data-category');

        // Update active button
        this.categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Load and display category insights
        this.displayCategoryInsights(category);
    }

    /**
     * Display category insights
     */
    displayCategoryInsights(category) {
        const analysis = patternAnalytics.analyzeCategory(category, this.allExercises);

        if (!analysis) {
            this.insightsDisplay.innerHTML = `
                <div class="empty-state">
                    <p>No exercises found in this category yet</p>
                </div>
            `;
            this.insightsDisplay.style.display = 'block';
            return;
        }

        // Display sections
        this.displayWhatHappened(analysis.whatHappened, analysis.timeframe);
        this.displayEmotionalPatterns(analysis.emotionalPatterns);
        this.displayInterpretationPatterns(analysis.interpretationPatterns);
        this.displayMostCommonPatterns(analysis.interpretationPatterns);
        this.displayRealityCheckImpact(analysis.realityCheckImpact);
        this.displayInsight(analysis.insight);

        this.insightsDisplay.style.display = 'block';
    }

    /**
     * Display "What Happened" section
     */
    displayWhatHappened(whatHappened, timeframe) {
        const subtitle = document.getElementById('whatHappenedSubtitle');
        subtitle.textContent = `Over the last 30 days (${timeframe} reflections):`;

        const list = document.getElementById('whatHappenedList');
        list.innerHTML = '';

        whatHappened.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${this.escapeHtml(item.theme)}</span>
                <span class="what-happened-count">${item.count}</span>
            `;
            list.appendChild(li);
        });
    }

    /**
     * Display emotional patterns chart
     */
    displayEmotionalPatterns(emotionalPatterns) {
        const chart = document.getElementById('emotionsChart');
        chart.innerHTML = '';

        emotionalPatterns.forEach(emotion => {
            const row = document.createElement('div');
            row.className = 'emotion-row';

            row.innerHTML = `
                <div class="emotion-label">${this.escapeHtml(emotion.emotion)}</div>
                <div class="emotion-bar-container">
                    <div class="emotion-bar" style="width: ${emotion.percentage}%">
                        ${emotion.percentage}%
                    </div>
                </div>
                <div class="emotion-percentage">${emotion.count}</div>
            `;

            chart.appendChild(row);
        });
    }

    /**
     * Display interpretation patterns table
     */
    displayInterpretationPatterns(interpretationPatterns) {
        const tbody = document.getElementById('patternsTableBody');
        tbody.innerHTML = '';

        interpretationPatterns.forEach(pattern => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(pattern.pattern)}</td>
                <td>${pattern.occurrences}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * Display most common cognitive patterns with examples
     */
    displayMostCommonPatterns(interpretationPatterns) {
        if (!this.patternsList) return;
        
        if (!interpretationPatterns || interpretationPatterns.length === 0) {
            this.patternsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No patterns identified yet</p>';
            return;
        }

        this.patternsList.innerHTML = interpretationPatterns.map((p, index) => {
            const examplesHtml = (p.examples && p.examples.length > 0) 
                ? p.examples.map(ex => {
                    const truncated = ex.length > 80 ? ex.substring(0, 80) + '...' : ex;
                    return `<li>"${this.escapeHtml(truncated)}"</li>`;
                }).join('')
                : '<li><em>No specific examples available</em></li>';
            
            return `
                <div class="pattern-item">
                    <div class="pattern-header">
                        <h4 class="pattern-number">${index + 1}. ${this.escapeHtml(p.pattern)}</h4>
                        <span class="pattern-count">Observed ${p.occurrences} time${p.occurrences !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="pattern-examples">
                        <p class="examples-label">Examples:</p>
                        <ul class="examples-list">
                            ${examplesHtml}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Display reality check impact
     */
    displayRealityCheckImpact(impact) {
        document.getElementById('beforeConfidence').textContent = impact.beforeAverage;
        document.getElementById('afterConfidence').textContent = impact.afterAverage;
    }

    /**
     * Display AI insight
     */
    displayInsight(insight) {
        const insightText = document.getElementById('insightText');
        insightText.textContent = insight;
    }
}

// Create global instance
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SoluluApp();
});

