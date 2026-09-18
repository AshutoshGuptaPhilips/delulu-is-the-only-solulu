/* ============================================
   SOLULU - Main Application
   Core application logic and UI interactions
   ============================================ */

class SoluluApp {
    constructor() {
        this.currentExercise = null;
        this.allExercises = [];
        this.isGenerating = false;
        this.breathingTimerId = null;
        this.breathingElapsedSeconds = 0;
        this.breathingPhaseSeconds = 0;
        this.breathingPhaseIndex = 0;
        this.breathingPhases = [
            { label: 'Inhale', seconds: 4 },
            { label: 'Hold', seconds: 4 },
            { label: 'Exhale', seconds: 4 },
            { label: 'Hold', seconds: 4 }
        ];
        this.jpmrStepIndex = -1;
        this.jpmrSteps = [
            'Hands and forearms: clench gently for 5 seconds, then release for 10 seconds.',
            'Upper arms: tense biceps for 5 seconds, then release fully.',
            'Shoulders and neck: lift shoulders up for 5 seconds, then drop and relax.',
            'Face and jaw: tighten face muscles for 5 seconds, then soften completely.',
            'Chest and back: take a deep breath and hold tension for 5 seconds, then release.',
            'Stomach: tighten core gently for 5 seconds, then release.',
            'Thighs: press thighs together for 5 seconds, then release.',
            'Calves and feet: point toes for 5 seconds, then relax and notice warmth.'
        ];
        this.coachProfileKey = 'solulu_life_coach_profile';
        this.coachMessagesKey = 'solulu_life_coach_messages';
        this.coachProfile = null;
        this.coachMessages = [];
        this.coachVoiceEnabled = false;
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
        this.loadLifeCoachState();
        this.renderLifeCoach();
        this.resetBreathingExercise();
        this.resetJPMR();
        await this.refreshDemoStatus();

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
        this.createFirstBtn = document.getElementById('createFirstBtn');

        // Mental Gym elements
        this.openCBTBtn = document.getElementById('openCBTBtn');
        this.backToGymBtn = document.getElementById('backToGymBtn');
        this.breathingPhase = document.getElementById('breathingPhase');
        this.breathingTimer = document.getElementById('breathingTimer');
        this.breathingStartBtn = document.getElementById('breathingStartBtn');
        this.breathingResetBtn = document.getElementById('breathingResetBtn');
        this.jpmrCurrentStep = document.getElementById('jpmrCurrentStep');
        this.jpmrStartBtn = document.getElementById('jpmrStartBtn');
        this.jpmrNextBtn = document.getElementById('jpmrNextBtn');

        // Consultation prep elements
        this.includeSummary = document.getElementById('includeSummary');
        this.includeTriggers = document.getElementById('includeTriggers');
        this.includeEmotions = document.getElementById('includeEmotions');
        this.includeReframes = document.getElementById('includeReframes');
        this.includeReflections = document.getElementById('includeReflections');
        this.includeActions = document.getElementById('includeActions');
        this.generateConsultationReportBtn = document.getElementById('generateConsultationReportBtn');
        this.copyConsultationReportBtn = document.getElementById('copyConsultationReportBtn');
        this.consultationReportOutput = document.getElementById('consultationReportOutput');
        this.consultationReportMeta = document.getElementById('consultationReportMeta');

        // Life coach elements
        this.coachSetupCard = document.getElementById('coachSetupCard');
        this.coachChatCard = document.getElementById('coachChatCard');
        this.coachNameInput = document.getElementById('coachNameInput');
        this.coachAgeInput = document.getElementById('coachAgeInput');
        this.coachGenderInput = document.getElementById('coachGenderInput');
        this.coachPersonalityInput = document.getElementById('coachPersonalityInput');
        this.createCoachBtn = document.getElementById('createCoachBtn');
        this.resetCoachBtn = document.getElementById('resetCoachBtn');
        this.coachVoiceToggleBtn = document.getElementById('coachVoiceToggleBtn');
        this.coachIdentity = document.getElementById('coachIdentity');
        this.coachEthicsNote = document.getElementById('coachEthicsNote');
        this.coachMessagesList = document.getElementById('coachMessages');
        this.coachMessageInput = document.getElementById('coachMessageInput');
        this.sendCoachMessageBtn = document.getElementById('sendCoachMessageBtn');

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
        this.demoStatus = document.getElementById('demoStatus');
        this.resetDemoBtn = document.getElementById('resetDemoBtn');
        this.loadNextDemoBtn = document.getElementById('loadNextDemoBtn');
        this.openProgressFromDemoBtn = document.getElementById('openProgressFromDemoBtn');
        this.weeklyJourneySubtitle = document.getElementById('weeklyJourneySubtitle');
        this.weeklyMomentumBadge = document.getElementById('weeklyMomentumBadge');
        this.weeklyAssumptionRate = document.getElementById('weeklyAssumptionRate');
        this.weeklyShiftScore = document.getElementById('weeklyShiftScore');
        this.weeklyTrendRows = document.getElementById('weeklyTrendRows');
        this.assumptionFill = document.getElementById('assumptionFill');
        this.factFill = document.getElementById('factFill');
        this.balancedFill = document.getElementById('balancedFill');
        this.assumptionValue = document.getElementById('assumptionValue');
        this.factValue = document.getElementById('factValue');
        this.balancedValue = document.getElementById('balancedValue');
        this.assumptionFactNarrative = document.getElementById('assumptionFactNarrative');
        this.triggerResponseMapList = document.getElementById('triggerResponseMapList');
        this.actionPlanList = document.getElementById('actionPlanList');

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
        this.createFirstBtn?.addEventListener('click', () => this.createNewExercise());
        this.openCBTBtn?.addEventListener('click', () => this.openCBTExercise());
        this.backToGymBtn?.addEventListener('click', () => this.openMentalGym());
        this.breathingStartBtn?.addEventListener('click', () => this.startBreathingExercise());
        this.breathingResetBtn?.addEventListener('click', () => this.resetBreathingExercise());
        this.jpmrStartBtn?.addEventListener('click', () => this.startJPMR());
        this.jpmrNextBtn?.addEventListener('click', () => this.nextJPMRStep());
        this.generateConsultationReportBtn?.addEventListener('click', () => this.generateConsultationReport());
        this.copyConsultationReportBtn?.addEventListener('click', () => this.copyConsultationReport());
        this.createCoachBtn?.addEventListener('click', () => this.createLifeCoach());
        this.resetCoachBtn?.addEventListener('click', () => this.resetLifeCoach());
        this.coachVoiceToggleBtn?.addEventListener('click', () => this.toggleCoachVoice());
        this.sendCoachMessageBtn?.addEventListener('click', () => this.sendCoachMessage());
        this.resetDemoBtn?.addEventListener('click', () => this.handleResetDemo());
        this.loadNextDemoBtn?.addEventListener('click', () => this.handleLoadNextDemo());
        this.openProgressFromDemoBtn?.addEventListener('click', () => {
            const progressTab = document.querySelector('[data-tab="progress"]');
            if (progressTab) {
                this.switchTab(progressTab);
            }
        });
        this.coachMessageInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendCoachMessage();
            }
        });

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
        window.addEventListener('beforeunload', () => {
            this.autoSaveExercise();
            this.stopBreathingExercise();
        });
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
            this.openRequiredReflectionSection();

            this.showToast('Alternate realities generated. Reflection is required. ✨', 'success');
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

        card.innerHTML = `
            <div class="reality-header">
                <div class="reality-number">${number}</div>
                <div class="reality-title">${this.escapeHtml(reality.title)}</div>
            </div>
            <div class="reality-content">
                ${this.escapeHtml(reality.content).replace(/\n/g, '<br>')}
            </div>
        `;

        return card;
    }

    /**
     * Check if current exercise has generated realities
     */
    hasCurrentExerciseRealities() {
        return Array.isArray(this.currentExercise?.realities) && this.currentExercise.realities.length > 0;
    }

    /**
     * Check if reflection exists either in saved data or current textarea
     */
    hasCurrentExerciseReflection() {
        const savedReflection = (this.currentExercise?.reflection || '').trim();
        const draftReflection = (this.reflectionInput?.value || '').trim();
        return savedReflection.length > 0 || draftReflection.length > 0;
    }

    /**
     * Open and label reflection section as required
     */
    openRequiredReflectionSection() {
        if (!this.reflectionContent || !this.reflectionToggle) {
            return;
        }

        this.reflectionContent.style.display = 'block';
        this.reflectionToggle.classList.add('open');

        const toggleText = this.reflectionToggle.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Your Reflection (Required)';
        }
    }

    /**
     * Prevent leaving the exercise until required reflection is provided
     */
    ensureReflectionCompletionBeforeLeaving() {
        if (!this.hasCurrentExerciseRealities()) {
            return true;
        }

        if (!this.hasCurrentExerciseReflection()) {
            this.outputSection.style.display = 'block';
            this.openRequiredReflectionSection();
            this.reflectionInput?.focus();
            this.showToast('Reflection is required before leaving this exercise.', 'warning');
            return false;
        }

        if ((this.currentExercise?.reflection || '').trim().length === 0) {
            const reflectionDraft = this.reflectionInput.value.trim();
            this.currentExercise = dataManager.updateExercise(this.currentExercise.id, {
                reflection: reflectionDraft,
                status: 'completed'
            });
        }

        return true;
    }

    /**
     * Toggle reflection section
     */
    toggleReflection() {
        const isOpen = this.reflectionContent.style.display !== 'none';

        if (isOpen && this.hasCurrentExerciseRealities() && !this.hasCurrentExerciseReflection()) {
            this.showToast('Reflection is required before closing this section.', 'warning');
            return;
        }

        this.reflectionContent.style.display = isOpen ? 'none' : 'block';
        this.reflectionToggle.classList.toggle('open');
        this.reflectionToggle.querySelector('.toggle-text').textContent =
            isOpen ? 'Expand to Add Required Reflection' : 'Your Reflection (Required)';
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
        if (!this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

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
        if (!this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

        this.autoSaveExercise();
        this.openExercisesModal();
    }

    /**
     * Open exercises modal
     */
    openExercisesModal() {
        if (!this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

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
        if (!this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

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
        const tabName = tabButton.getAttribute('data-tab');

        const activeTab = document.querySelector('.tab-content.active')?.id;
        if (activeTab === 'cbt-exercise' && tabName !== 'cbt-exercise' && !this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

        this.activateTab(tabName, tabName);
    }

    /**
     * Open the CBT exercise from Mental Gym
     */
    openCBTExercise() {
        if (!this.currentExercise) {
            this.loadCurrentExercise();
        }
        this.activateTab('cbt-exercise', 'mental-gym');
    }

    /**
     * Return to Mental Gym
     */
    openMentalGym() {
        if (!this.ensureReflectionCompletionBeforeLeaving()) {
            return;
        }

        this.activateTab('mental-gym', 'mental-gym');
    }

    /**
     * Activate a tab content and optionally highlight a nav tab
     */
    activateTab(tabName, navTabName = tabName) {
        // Update active nav button
        this.navTabs.forEach(tab => tab.classList.remove('active'));
        const navTarget = Array.from(this.navTabs).find(tab => tab.getAttribute('data-tab') === navTabName);
        if (navTarget) {
            navTarget.classList.add('active');
        }

        // Update active tab content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName) {
                content.classList.add('active');
            }
        });

        this.runTabLoaders(tabName);
    }

    /**
     * Run tab-specific loading logic
     */
    runTabLoaders(tabName) {
        if (tabName === 'pattern-insights') {
            this.loadPatternInsights();
            this.refreshDemoStatus();
        }

        if (tabName === 'progress') {
            this.loadProgress();
            this.refreshDemoStatus();
        }

        if (tabName === 'consultation-prep') {
            this.updateConsultationMeta('Ready to generate report');
        }

        if (tabName === 'life-coach') {
            this.renderLifeCoach();
        }
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

        // Load first available category with data
        const categoriesWithData = patternAnalytics.getAllCategoriesWithData(this.allExercises);
        const firstCategory = Object.keys(categoriesWithData)[0] || 'General Insights';
        this.handleCategorySelect(document.querySelector(`[data-category="${firstCategory}"]`));
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
        const mostCommonCategoryEl = document.getElementById('mostCommonCategory');
        if (mostCommonCategoryEl) {
            mostCommonCategoryEl.textContent = stats.mostCommonCategory
                .replace(' Pattern Insights', '')
                .replace(' Insights', '');
        }

        const allCategories = patternAnalytics.getAllCategoriesWithData(exercises);
        const journeys = Object.values(allCategories)
            .map(item => item.weeklyPatternJourney)
            .filter(Boolean)
            .map(journey => journey.momentum);

        const momentum = journeys.includes('Strong improvement')
            ? 'Strong improvement'
            : journeys.includes('Steady improvement')
                ? 'Steady improvement'
                : journeys.includes('Watch assumptions this week')
                    ? 'Watch assumptions'
                    : 'Stable trend';

        const weeklyMomentumValueEl = document.getElementById('weeklyMomentumValue');
        if (weeklyMomentumValueEl) {
            weeklyMomentumValueEl.textContent = momentum;
        }
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
        this.displayWeeklyPatternJourney(analysis.weeklyPatternJourney);
        this.displayAssumptionFactProfile(analysis.assumptionFactProfile);
        this.displayTriggerResponseMap(analysis.triggerResponseMap);
        this.displayActionPlan(analysis.recommendedActions);
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
     * Display weekly journey trend metrics
     */
    displayWeeklyPatternJourney(weeklyJourney) {
        if (!weeklyJourney || !Array.isArray(weeklyJourney.trend)) {
            return;
        }

        const trend = weeklyJourney.trend;
        const current = weeklyJourney.currentWeek;

        if (this.weeklyJourneySubtitle) {
            this.weeklyJourneySubtitle.textContent = `Last ${trend.length} week${trend.length === 1 ? '' : 's'} trend`;
        }

        if (this.weeklyMomentumBadge) {
            this.weeklyMomentumBadge.textContent = weeklyJourney.momentum;
        }

        if (this.weeklyAssumptionRate && current) {
            this.weeklyAssumptionRate.textContent = `${current.assumptionPercent}%`;
        }

        if (this.weeklyShiftScore && current) {
            this.weeklyShiftScore.textContent = `${current.averageShift}`;
        }

        if (!this.weeklyTrendRows) {
            return;
        }

        this.weeklyTrendRows.innerHTML = trend.map(row => `
            <div class="weekly-row">
                <div class="weekly-label">${this.escapeHtml(row.label)}</div>
                <div class="weekly-bars">
                    <div class="weekly-bar assumption" style="width: ${row.assumptionPercent}%">A ${row.assumptionPercent}%</div>
                    <div class="weekly-bar fact" style="width: ${row.factPercent}%">F ${row.factPercent}%</div>
                </div>
                <div class="weekly-meta">
                    <span>${row.exerciseCount} entries</span>
                    <span>Shift ${row.averageShift}</span>
                    <span>${this.escapeHtml(row.dominantEmotion)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Display assumption vs fact profile
     */
    displayAssumptionFactProfile(profile) {
        if (!profile) {
            return;
        }

        if (this.assumptionFill) {
            this.assumptionFill.style.width = `${profile.assumptionPct}%`;
        }
        if (this.factFill) {
            this.factFill.style.width = `${profile.factPct}%`;
        }
        if (this.balancedFill) {
            this.balancedFill.style.width = `${profile.balancedPct}%`;
        }

        if (this.assumptionValue) {
            this.assumptionValue.textContent = `${profile.assumptionPct}%`;
        }
        if (this.factValue) {
            this.factValue.textContent = `${profile.factPct}%`;
        }
        if (this.balancedValue) {
            this.balancedValue.textContent = `${profile.balancedPct}%`;
        }

        if (this.assumptionFactNarrative) {
            this.assumptionFactNarrative.textContent = profile.narrative;
        }
    }

    /**
     * Display trigger to reaction mapping
     */
    displayTriggerResponseMap(rows) {
        if (!this.triggerResponseMapList) {
            return;
        }

        if (!rows || rows.length === 0) {
            this.triggerResponseMapList.innerHTML = '<p class="insight-subtitle">No recurring trigger sequence identified yet.</p>';
            return;
        }

        this.triggerResponseMapList.innerHTML = rows.map(row => `
            <div class="trigger-row">
                <div class="trigger-theme">${this.escapeHtml(row.theme)} (${row.count})</div>
                <div class="trigger-sequence">
                    <span class="sequence-node">${this.escapeHtml(row.dominantEmotion)}</span>
                    <span class="sequence-arrow">→</span>
                    <span class="sequence-node reaction">${this.escapeHtml(row.dominantReaction)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Display recommended weekly actions
     */
    displayActionPlan(actions) {
        if (!this.actionPlanList) {
            return;
        }

        if (!actions || actions.length === 0) {
            this.actionPlanList.innerHTML = '<li>Keep logging daily entries to build a stronger pattern baseline.</li>';
            return;
        }

        this.actionPlanList.innerHTML = actions.map(action => `<li>${this.escapeHtml(action)}</li>`).join('');
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

    /**
     * Refresh demo progress label and button state
     */
    async refreshDemoStatus() {
        if (!this.demoStatus) {
            return;
        }

        if (!dataManager.isDemoMode()) {
            this.demoStatus.textContent = 'Demo mode is off. Click Reset Demo to start staged loading.';
            if (this.loadNextDemoBtn) {
                this.loadNextDemoBtn.disabled = false;
                this.loadNextDemoBtn.textContent = 'Load Next 10 Exercises';
            }
            return;
        }

        const progress = await dataManager.getDemoProgress();
        this.demoStatus.textContent = `Demo dataset loaded: ${progress.loaded} / ${progress.total}`;

        if (this.loadNextDemoBtn) {
            this.loadNextDemoBtn.disabled = progress.done;
            this.loadNextDemoBtn.textContent = progress.done
                ? 'All Demo Exercises Loaded'
                : 'Load Next 10 Exercises';
        }
    }

    /**
     * Reset dataset for incremental demo flow
     */
    async handleResetDemo() {
        const reset = await dataManager.resetForIncrementalDemo();
        this.currentExercise = null;

        if (this.eventInput) this.eventInput.value = '';
        if (this.emotionInput) this.emotionInput.value = '';
        if (this.interpretationInput) this.interpretationInput.value = '';
        if (this.reflectionInput) this.reflectionInput.value = '';
        if (this.outputSection) this.outputSection.style.display = 'none';

        this.setupCharacterCounters();
        this.loadPatternInsights();
        this.loadProgress();
        await this.refreshDemoStatus();

        this.showToast(`Demo reset. ${reset.total} exercises ready for staged loading.`, 'info');
    }

    /**
     * Load next demo batch and refresh analysis tabs
     */
    async handleLoadNextDemo() {
        if (!dataManager.isDemoMode()) {
            this.showToast('Click Reset Demo first to avoid mixing with existing data.', 'warning');
            return;
        }

        const result = await dataManager.loadNextDemoBatch(10);

        if (result.added === 0) {
            this.showToast('All demo exercises are already loaded.', 'info');
            await this.refreshDemoStatus();
            return;
        }

        if (!this.currentExercise) {
            const latestExercise = dataManager.getAllExercises().slice(-1)[0];
            if (latestExercise) {
                dataManager.setCurrentExerciseId(latestExercise.id);
                this.loadCurrentExercise();
            }
        }

        this.loadPatternInsights();
        this.loadProgress();
        await this.refreshDemoStatus();

        this.showToast(
            `Loaded ${result.added} exercises. Total loaded: ${result.loaded}/${result.total}`,
            'success'
        );
    }

    /**
     * Start guided box breathing timer
     */
    startBreathingExercise() {
        this.stopBreathingExercise();
        this.breathingElapsedSeconds = 0;
        this.breathingPhaseIndex = 0;
        this.breathingPhaseSeconds = this.breathingPhases[0].seconds;

        if (this.breathingStartBtn) {
            this.breathingStartBtn.disabled = true;
        }

        this.renderBreathingState();

        this.breathingTimerId = setInterval(() => {
            this.breathingElapsedSeconds += 1;
            this.breathingPhaseSeconds -= 1;

            if (this.breathingElapsedSeconds >= 120) {
                this.stopBreathingExercise();
                if (this.breathingPhase) {
                    this.breathingPhase.textContent = 'Cycle complete. Notice your body and breath.';
                }
                if (this.breathingStartBtn) {
                    this.breathingStartBtn.disabled = false;
                }
                this.showToast('Box breathing cycle complete', 'success');
                return;
            }

            if (this.breathingPhaseSeconds <= 0) {
                this.breathingPhaseIndex = (this.breathingPhaseIndex + 1) % this.breathingPhases.length;
                this.breathingPhaseSeconds = this.breathingPhases[this.breathingPhaseIndex].seconds;
            }

            this.renderBreathingState();
        }, 1000);
    }

    /**
     * Stop guided box breathing timer
     */
    stopBreathingExercise() {
        if (this.breathingTimerId) {
            clearInterval(this.breathingTimerId);
            this.breathingTimerId = null;
        }
    }

    /**
     * Reset guided box breathing timer state
     */
    resetBreathingExercise() {
        this.stopBreathingExercise();
        this.breathingElapsedSeconds = 0;
        this.breathingPhaseIndex = 0;
        this.breathingPhaseSeconds = this.breathingPhases[0].seconds;
        if (this.breathingPhase) {
            this.breathingPhase.textContent = 'Ready: inhale for 4 seconds';
        }
        if (this.breathingTimer) {
            this.breathingTimer.textContent = '00:00';
        }
        if (this.breathingStartBtn) {
            this.breathingStartBtn.disabled = false;
        }
    }

    /**
     * Render box breathing phase and timer
     */
    renderBreathingState() {
        const phase = this.breathingPhases[this.breathingPhaseIndex];
        if (this.breathingPhase) {
            this.breathingPhase.textContent = `${phase.label} for ${this.breathingPhaseSeconds}s`;
        }
        if (this.breathingTimer) {
            this.breathingTimer.textContent = this.formatSeconds(this.breathingElapsedSeconds);
        }
    }

    /**
     * Start guided JPMR sequence
     */
    startJPMR() {
        this.jpmrStepIndex = 0;
        if (this.jpmrNextBtn) {
            this.jpmrNextBtn.disabled = false;
        }
        this.renderJPMRStep();
        this.showToast('JPMR started. Follow each step slowly.', 'info');
    }

    /**
     * Advance to next JPMR step
     */
    nextJPMRStep() {
        if (this.jpmrStepIndex < 0) {
            this.startJPMR();
            return;
        }

        this.jpmrStepIndex += 1;

        if (this.jpmrStepIndex >= this.jpmrSteps.length) {
            if (this.jpmrCurrentStep) {
                this.jpmrCurrentStep.textContent = 'JPMR complete. Sit quietly for 30 seconds and observe how your body feels.';
            }
            if (this.jpmrNextBtn) {
                this.jpmrNextBtn.disabled = true;
            }
            this.showToast('JPMR complete', 'success');
            return;
        }

        this.renderJPMRStep();
    }

    /**
     * Reset JPMR sequence state
     */
    resetJPMR() {
        this.jpmrStepIndex = -1;
        if (this.jpmrCurrentStep) {
            this.jpmrCurrentStep.textContent = 'Press start to begin guided JPMR';
        }
        if (this.jpmrNextBtn) {
            this.jpmrNextBtn.disabled = true;
        }
    }

    /**
     * Render current JPMR instruction
     */
    renderJPMRStep() {
        if (!this.jpmrCurrentStep || this.jpmrStepIndex < 0 || this.jpmrStepIndex >= this.jpmrSteps.length) {
            return;
        }

        this.jpmrCurrentStep.textContent = `Step ${this.jpmrStepIndex + 1}/${this.jpmrSteps.length}: ${this.jpmrSteps[this.jpmrStepIndex]}`;
    }

    /**
     * Generate a clinician-ready consultation report from exercise history
     */
    generateConsultationReport() {
        const exercises = dataManager
            .getAllExercises()
            .filter(ex => ex.event || ex.emotion || ex.interpretation)
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

        if (exercises.length === 0) {
            this.showToast('No exercise data available yet', 'warning');
            return;
        }

        const lines = [];
        const now = new Date();
        lines.push('SOLULU CONSULTATION PREPARATION REPORT');
        lines.push(`Generated: ${now.toLocaleString()}`);
        lines.push('Purpose: Share structured observations before a mental health consultation.');
        lines.push('');

        if (this.includeSummary?.checked) {
            const completed = exercises.filter(ex => ex.reflection && ex.reflection.trim().length > 0).length;
            const generated = exercises.filter(ex => ex.realities && ex.realities.length > 0).length;
            lines.push('1) Overview');
            lines.push(`- Total exercises logged: ${exercises.length}`);
            lines.push(`- Exercises with generated reframes: ${generated}`);
            lines.push(`- Exercises with reflection notes: ${completed}`);
            lines.push(`- Date range: ${dataManager.formatDate(exercises[exercises.length - 1].createdAt)} to ${dataManager.formatDate(exercises[0].createdAt)}`);
            lines.push('');
        }

        if (this.includeTriggers?.checked) {
            const categoryCounts = {};
            exercises.forEach(ex => {
                const key = ex.category || 'General';
                categoryCounts[key] = (categoryCounts[key] || 0) + 1;
            });

            const topCategories = Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);

            lines.push('2) Recurring Trigger Contexts');
            if (topCategories.length === 0) {
                lines.push('- No clear category trends yet.');
            } else {
                topCategories.forEach(([name, count]) => {
                    lines.push(`- ${name}: ${count} entries`);
                });
            }
            lines.push('');
        }

        if (this.includeEmotions?.checked) {
            const emotionCounts = this.extractTopEmotions(exercises);
            lines.push('3) Frequent Emotions');
            if (emotionCounts.length === 0) {
                lines.push('- No emotion data available yet.');
            } else {
                emotionCounts.forEach(item => {
                    lines.push(`- ${item.emotion}: ${item.count} mentions`);
                });
            }
            lines.push('');
        }

        if (this.includeReframes?.checked) {
            const reframes = this.collectReframeHighlights(exercises, 4);
            lines.push('4) Helpful Cognitive Reframes');
            if (reframes.length === 0) {
                lines.push('- No generated reframes available yet.');
            } else {
                reframes.forEach((item, index) => {
                    lines.push(`${index + 1}. ${item}`);
                });
            }
            lines.push('');
        }

        if (this.includeReflections?.checked) {
            const reflections = exercises
                .filter(ex => ex.reflection && ex.reflection.trim())
                .slice(0, 4)
                .map(ex => ex.reflection.trim().replace(/\s+/g, ' '));

            lines.push('5) Reflection Notes');
            if (reflections.length === 0) {
                lines.push('- No reflection notes entered yet.');
            } else {
                reflections.forEach((text, index) => {
                    lines.push(`${index + 1}. ${text}`);
                });
            }
            lines.push('');
        }

        if (this.includeActions?.checked) {
            lines.push('6) Suggested Agenda For Consultation');
            lines.push('- Discuss repeated trigger situations and emotional spikes.');
            lines.push('- Validate cognitive reframing techniques that worked best.');
            lines.push('- Identify coping tools for high-risk moments.');
            lines.push('- Agree on a plan for follow-up tracking between sessions.');
            lines.push('');
        }

        lines.push('Note: This report is a self-tracking summary and not a clinical diagnosis.');

        if (this.consultationReportOutput) {
            this.consultationReportOutput.value = lines.join('\n');
        }

        this.updateConsultationMeta(`Generated from ${exercises.length} exercises at ${now.toLocaleTimeString()}`);
        this.showToast('Consultation report generated', 'success');
    }

    /**
     * Copy consultation report to clipboard
     */
    copyConsultationReport() {
        const report = this.consultationReportOutput?.value?.trim();
        if (!report) {
            this.showToast('Generate a report first', 'warning');
            return;
        }

        navigator.clipboard.writeText(report).then(() => {
            this.showToast('Report copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy report', 'error');
        });
    }

    /**
     * Update consultation report helper text
     */
    updateConsultationMeta(text) {
        if (this.consultationReportMeta) {
            this.consultationReportMeta.textContent = text;
        }
    }

    /**
     * Extract most frequent emotions from saved exercises
     */
    extractTopEmotions(exercises) {
        const counts = {};

        exercises.forEach(ex => {
            const raw = (ex.emotion || '').toLowerCase();
            raw
                .split(/,|\/| and |\.|;/)
                .map(part => part.trim())
                .filter(Boolean)
                .forEach(part => {
                    counts[part] = (counts[part] || 0) + 1;
                });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([emotion, count]) => ({ emotion, count }));
    }

    /**
     * Collect concise reframe highlights for consultation report
     */
    collectReframeHighlights(exercises, limit = 4) {
        const highlights = [];

        for (const exercise of exercises) {
            if (!exercise.realities || exercise.realities.length === 0) {
                continue;
            }

            for (const reality of exercise.realities) {
                if (!reality || !reality.content) {
                    continue;
                }

                const sentence = reality.content
                    .replace(/\s+/g, ' ')
                    .split(/\.|\n/)
                    .map(part => part.trim())
                    .find(Boolean);

                if (sentence) {
                    highlights.push(sentence.endsWith('.') ? sentence : `${sentence}.`);
                }

                if (highlights.length >= limit) {
                    return highlights;
                }
            }
        }

        return highlights;
    }

    /**
     * Load coach profile and messages from local storage
     */
    loadLifeCoachState() {
        try {
            const rawProfile = localStorage.getItem(this.coachProfileKey);
            const rawMessages = localStorage.getItem(this.coachMessagesKey);
            this.coachProfile = rawProfile ? JSON.parse(rawProfile) : null;
            this.coachMessages = rawMessages ? JSON.parse(rawMessages) : [];
        } catch (error) {
            console.warn('Failed to load life coach state', error);
            this.coachProfile = null;
            this.coachMessages = [];
        }
    }

    /**
     * Persist coach profile and messages
     */
    saveLifeCoachState() {
        localStorage.setItem(this.coachProfileKey, JSON.stringify(this.coachProfile));
        localStorage.setItem(this.coachMessagesKey, JSON.stringify(this.coachMessages));
    }

    /**
     * Create life coach profile from form
     */
    createLifeCoach() {
        const name = this.coachNameInput?.value?.trim();
        const age = this.coachAgeInput?.value?.trim();
        const gender = this.coachGenderInput?.value?.trim();
        const personality = this.coachPersonalityInput?.value?.trim();

        if (!name || !age || !gender || !personality) {
            this.showToast('Please complete all coach profile fields', 'warning');
            return;
        }

        this.coachProfile = {
            name,
            age,
            gender,
            personality,
            createdAt: new Date().toISOString()
        };

        this.coachMessages = [
            {
                role: 'coach',
                text: `Hi, I am ${name}. I am here to support your goals with practical and ethical coaching. What would you like to work on today?`,
                createdAt: new Date().toISOString()
            }
        ];

        this.saveLifeCoachState();
        this.renderLifeCoach();
        this.showToast('Life coach created', 'success');
    }

    /**
     * Reset coach profile and chat history
     */
    resetLifeCoach() {
        this.coachProfile = null;
        this.coachMessages = [];
        localStorage.removeItem(this.coachProfileKey);
        localStorage.removeItem(this.coachMessagesKey);

        if (this.coachNameInput) this.coachNameInput.value = '';
        if (this.coachAgeInput) this.coachAgeInput.value = '';
        if (this.coachGenderInput) this.coachGenderInput.value = '';
        if (this.coachPersonalityInput) this.coachPersonalityInput.value = '';
        if (this.coachMessageInput) this.coachMessageInput.value = '';

        this.coachVoiceEnabled = false;
        this.renderLifeCoach();
        this.showToast('Life coach reset', 'info');
    }

    /**
     * Toggle coach voice reply mode
     */
    toggleCoachVoice() {
        if (!window.speechSynthesis) {
            this.showToast('Voice replies are not supported in this browser', 'warning');
            return;
        }

        this.coachVoiceEnabled = !this.coachVoiceEnabled;
        if (this.coachVoiceToggleBtn) {
            this.coachVoiceToggleBtn.textContent = `Voice Reply: ${this.coachVoiceEnabled ? 'On' : 'Off'}`;
        }
    }

    /**
     * Render life coach setup and chat views
     */
    renderLifeCoach() {
        const hasProfile = Boolean(this.coachProfile);

        if (this.coachSetupCard) {
            this.coachSetupCard.style.display = hasProfile ? 'none' : 'block';
        }

        if (this.coachChatCard) {
            this.coachChatCard.style.display = hasProfile ? 'block' : 'none';
        }

        if (!hasProfile) {
            return;
        }

        if (this.coachIdentity) {
            this.coachIdentity.textContent = `${this.coachProfile.name}, ${this.coachProfile.age} (${this.coachProfile.gender})`;
        }

        if (this.coachEthicsNote) {
            this.coachEthicsNote.textContent = `Style: ${this.coachProfile.personality}. Ethical AI coach: motivational support, not medical diagnosis.`;
        }

        if (this.coachVoiceToggleBtn) {
            this.coachVoiceToggleBtn.textContent = `Voice Reply: ${this.coachVoiceEnabled ? 'On' : 'Off'}`;
        }

        this.renderCoachMessages();
    }

    /**
     * Render coach messages
     */
    renderCoachMessages() {
        if (!this.coachMessagesList) {
            return;
        }

        this.coachMessagesList.innerHTML = '';

        this.coachMessages.forEach(message => {
            const container = document.createElement('div');
            container.className = `coach-message ${message.role}`;

            const bubble = document.createElement('div');
            bubble.className = 'coach-bubble';
            bubble.innerHTML = this.escapeHtml(message.text).replace(/\n/g, '<br>');

            const time = document.createElement('div');
            time.className = 'coach-time';
            time.textContent = dataManager.formatTime(message.createdAt);

            container.appendChild(bubble);
            container.appendChild(time);
            this.coachMessagesList.appendChild(container);
        });

        this.coachMessagesList.scrollTop = this.coachMessagesList.scrollHeight;
    }

    /**
     * Send user message to coach and render coach response
     */
    sendCoachMessage() {
        if (!this.coachProfile) {
            this.showToast('Create your life coach first', 'warning');
            return;
        }

        const text = this.coachMessageInput?.value?.trim();
        if (!text) {
            return;
        }

        this.coachMessages.push({
            role: 'user',
            text,
            createdAt: new Date().toISOString()
        });

        const reply = this.generateCoachReply(text);
        this.coachMessages.push({
            role: 'coach',
            text: reply,
            createdAt: new Date().toISOString()
        });

        this.saveLifeCoachState();
        this.renderCoachMessages();

        if (this.coachMessageInput) {
            this.coachMessageInput.value = '';
        }

        if (this.coachVoiceEnabled && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(reply);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    /**
     * Generate a grounded coaching response
     */
    generateCoachReply(message) {
        const text = message.toLowerCase();
        const coachName = this.coachProfile?.name || 'Coach';

        const highRiskSignals = ['suicide', 'kill myself', 'self harm', 'hurt myself', 'end my life'];
        if (highRiskSignals.some(signal => text.includes(signal))) {
            return `${coachName}: I care about your safety. I am not equipped for crisis support. Please contact local emergency services or a trusted person immediately, and reach out to a crisis hotline in your country right now.`;
        }

        let focus = 'build one small action for today';
        if (text.includes('anxious') || text.includes('anxiety') || text.includes('panic')) {
            focus = 'stabilize your body first using one minute of slow breathing, then write one balanced thought';
        } else if (text.includes('procrast') || text.includes('avoid')) {
            focus = 'start a 10-minute sprint on the smallest possible task';
        } else if (text.includes('manager') || text.includes('team') || text.includes('work')) {
            focus = 'prepare one clear, factual message and one request for support';
        } else if (text.includes('relationship') || text.includes('family') || text.includes('friend')) {
            focus = 'name your need in one sentence and ask for a calm conversation window';
        }

        const recent = dataManager.getAllExercises().slice(-1)[0];
        const contextLine = recent && recent.event
            ? `I also noticed your recent CBT context: "${recent.event.substring(0, 80)}${recent.event.length > 80 ? '...' : ''}".`
            : 'You are doing the right thing by checking in instead of bottling this up.';

        return [
            `${coachName}: ${contextLine}`,
            `Let us focus on this next step: ${focus}.`,
            'Plan for the next 15 minutes:',
            '1. Ground: 4 slow breaths while relaxing shoulders.',
            '2. Clarity: write one sentence about what is in your control.',
            '3. Action: complete one tiny action before checking your phone again.'
        ].join('\n');
    }

    /**
     * Format elapsed seconds as mm:ss
     */
    formatSeconds(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
}

// Create global instance
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SoluluApp();
});

