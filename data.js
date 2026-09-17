/* ============================================
   SOLULU - Data Management
   Handles localStorage and data persistence
   ============================================ */

class DataManager {
    constructor() {
        this.storageKey = 'solulu_exercises';
        this.currentExerciseKey = 'solulu_current_exercise';
        this.seedVersionKey = 'solulu_seed_version';
        this.seedMigrationKey = 'solulu_seed_id_migration_v1';
        this.demoModeKey = 'solulu_demo_mode';
        this.demoIndexKey = 'solulu_demo_index';
        this.seedVersion = 'dataset_v4_unique_ids';
        this.demoPoolCache = null;
        this.datasetFiles = [
            'dataset/workplace_conflict.json',
            'dataset/manager_feedback.json',
            'dataset/performance_anxiety.json',
            'dataset/career_uncertainty.json',
            'dataset/relationships.json',
            'dataset/family_disagreements.json',
            'dataset/social_situations.json',
            'dataset/public_speaking.json',
            'dataset/selfesteem.json',
            'dataset/health-concerns.json'
        ];
    }

    /**
     * Seed exercises from dataset files (runs once on a fresh install)
     */
    async seedExercisesFromDatasets() {
        if (this.isDemoMode()) {
            return { seeded: false, count: 0 };
        }

        try {
            const datasetResults = await Promise.all(this.datasetFiles.map(file => this.loadDatasetFile(file)));
            const datasets = datasetResults.map(result => result.data);
            const allFilesLoaded = datasetResults.every(result => result.ok);

            const flattened = datasets.flatMap(items => Array.isArray(items) ? items : []);
            const seededExercises = flattened.map((item, index) => this.mapDatasetItemToExercise(item, index));
            const existingExercises = this.getAllExercises();

            const migrationResult = this.ensureCompleteSeedCoverage(existingExercises, seededExercises);
            const exercisesAfterMigration = migrationResult.exercises;
            const existingIds = new Set(exercisesAfterMigration.map(ex => ex.id));
            const missingSeededExercises = seededExercises.filter(ex => !existingIds.has(ex.id));

            if (missingSeededExercises.length > 0) {
                this.saveExercises([...exercisesAfterMigration, ...missingSeededExercises]);
                if (allFilesLoaded) {
                    localStorage.setItem(this.seedVersionKey, this.seedVersion);
                }
                return {
                    seeded: true,
                    count: missingSeededExercises.length + migrationResult.addedCount
                };
            }

            if (migrationResult.addedCount > 0) {
                this.saveExercises(exercisesAfterMigration);
                if (allFilesLoaded) {
                    localStorage.setItem(this.seedVersionKey, this.seedVersion);
                }
                return { seeded: true, count: migrationResult.addedCount };
            }

            if (allFilesLoaded) {
                localStorage.setItem(this.seedVersionKey, this.seedVersion);
            }
            return { seeded: false, count: 0 };
        } catch (error) {
            console.error('Failed to seed dataset exercises:', error);
            return { seeded: false, count: 0 };
        }
    }

    /**
     * Load one dataset file with fetch, then fallback to XHR for file:// usage
     */
    async loadDatasetFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const parsed = await response.json();
                return { ok: true, data: Array.isArray(parsed) ? parsed : [] };
            }
        } catch (error) {
            // Continue to XHR fallback
        }

        return await this.loadDatasetFileViaXHR(filePath);
    }

    /**
     * XHR fallback for environments where fetch blocks local files
     */
    loadDatasetFileViaXHR(filePath) {
        return new Promise((resolve) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', filePath, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        // status 0 can occur on file:// URLs
                        if (xhr.status === 200 || xhr.status === 0) {
                            try {
                                const parsed = JSON.parse(xhr.responseText);
                                resolve({ ok: true, data: Array.isArray(parsed) ? parsed : [] });
                            } catch (parseError) {
                                resolve({ ok: false, data: [] });
                            }
                        } else {
                            resolve({ ok: false, data: [] });
                        }
                    }
                };
                xhr.onerror = function() {
                    resolve({ ok: false, data: [] });
                };
                xhr.send();
            } catch (error) {
                resolve({ ok: false, data: [] });
            }
        });
    }

    /**
     * Convert dataset item shape to app exercise shape
     */
    mapDatasetItemToExercise(item, index, options = {}) {
        const now = new Date();
        const createdAt = options.createdAt ? new Date(options.createdAt) : new Date(now);
        if (!options.createdAt) {
            createdAt.setDate(now.getDate() - (index % 30));
            createdAt.setMinutes(createdAt.getMinutes() - index);
        }

        const idPrefix = options.idPrefix || 'seed';
        const baseId = item.id || index + 1;
        const mappedId = idPrefix === 'seed'
            ? `seed_${baseId}`
            : `${idPrefix}_${baseId}_${index + 1}`;

        const alternateRealityChecks = Array.isArray(item.alternateRealityChecks)
            ? item.alternateRealityChecks
            : [];

        const realities = alternateRealityChecks.slice(0, 4).map((content, realityIndex) => ({
            id: realityIndex + 1,
            title: `Alternative Perspective ${realityIndex + 1}`,
            type: 'alternate',
            content: content
        }));

        const reflectionParts = [
            item.revisedInterpretation,
            item.outcomeOneWeekLater
        ].filter(Boolean);

        return {
            id: mappedId,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
            event: item.event || '',
            emotion: item.emotion || '',
            interpretation: item.rawInterpretation || item.interpretation || '',
            realities: realities,
            reflection: reflectionParts.join(' '),
            status: reflectionParts.length > 0 ? 'completed' : 'generated',
            category: item.category || 'General',
            confidenceBefore: Number.isFinite(item.confidenceBefore) ? item.confidenceBefore : null,
            confidenceAfter: Number.isFinite(item.confidenceAfter) ? item.confidenceAfter : null,
            cognitiveDistortion: item.cognitiveDistortion || '',
            chosenBehaviour: item.chosenBehaviour || '',
            outcomeOneWeekLater: item.outcomeOneWeekLater || ''
        };
    }

    /**
     * Whether demo mode is enabled
     */
    isDemoMode() {
        return localStorage.getItem(this.demoModeKey) === 'true';
    }

    /**
     * Toggle demo mode
     */
    setDemoMode(enabled) {
        localStorage.setItem(this.demoModeKey, enabled ? 'true' : 'false');
    }

    /**
     * Build and cache sorted demo pool from all datasets
     */
    async getDemoPool() {
        if (this.demoPoolCache) {
            return this.demoPoolCache;
        }

        const datasetResults = await Promise.all(this.datasetFiles.map(file => this.loadDatasetFile(file)));
        const flattened = datasetResults.flatMap(result => Array.isArray(result.data) ? result.data : []);

        this.demoPoolCache = flattened
            .filter(item => item && item.event)
            .map((item, index) => ({
                ...item,
                __index: index,
                __improvement: (Number(item.confidenceBefore) || 70) - (Number(item.confidenceAfter) || 60)
            }))
            .sort((a, b) => a.__improvement - b.__improvement);

        return this.demoPoolCache;
    }

    /**
     * Reset all app data for incremental demo flow
     */
    async resetForIncrementalDemo() {
        this.clearAllData();
        this.setDemoMode(true);
        localStorage.setItem(this.demoIndexKey, '0');
        this.demoPoolCache = null;
        const pool = await this.getDemoPool();
        return {
            loaded: 0,
            total: pool.length,
            remaining: pool.length
        };
    }

    /**
     * Load next demo batch of dataset exercises
     */
    async loadNextDemoBatch(batchSize = 10) {
        this.setDemoMode(true);

        const pool = await this.getDemoPool();
        const start = Number(localStorage.getItem(this.demoIndexKey) || 0);

        if (start >= pool.length) {
            return {
                added: 0,
                loaded: pool.length,
                total: pool.length,
                remaining: 0,
                done: true
            };
        }

        const end = Math.min(start + batchSize, pool.length);
        const allExercises = this.getAllExercises();
        const existingIds = new Set(allExercises.map(ex => ex.id));
        const now = new Date();
        const totalWeeks = 5;
        let added = 0;

        for (let i = start; i < end; i++) {
            const weekIndex = Math.floor(i / batchSize);
            const weeksAgo = Math.max(0, (totalWeeks - 1) - weekIndex);
            const createdAt = new Date(now);
            createdAt.setDate(now.getDate() - (weeksAgo * 7) + (i % 5));
            createdAt.setHours(9 + (i % 8), (i * 7) % 60, 0, 0);

            const mapped = this.mapDatasetItemToExercise(pool[i], i, {
                idPrefix: 'demo',
                createdAt
            });

            mapped.demoBatch = weekIndex + 1;

            if (!existingIds.has(mapped.id)) {
                allExercises.push(mapped);
                existingIds.add(mapped.id);
                added++;
            }
        }

        allExercises.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        this.saveExercises(allExercises);
        localStorage.setItem(this.demoIndexKey, String(end));

        return {
            added,
            loaded: end,
            total: pool.length,
            remaining: Math.max(0, pool.length - end),
            done: end >= pool.length
        };
    }

    /**
     * Return current incremental demo progress
     */
    async getDemoProgress() {
        const pool = await this.getDemoPool();
        const loaded = Number(localStorage.getItem(this.demoIndexKey) || 0);
        return {
            loaded,
            total: pool.length,
            remaining: Math.max(0, pool.length - loaded),
            done: loaded >= pool.length
        };
    }

    /**
     * One-time migration: ensure each seeded ID from dataset exists in storage
     */
    ensureCompleteSeedCoverage(existingExercises, seededExercises) {
        if (localStorage.getItem(this.seedMigrationKey) === 'done') {
            return { exercises: existingExercises, addedCount: 0 };
        }

        const existingIds = new Set(existingExercises.map(ex => ex.id));
        const missingById = seededExercises.filter(ex => !existingIds.has(ex.id));

        if (missingById.length === 0) {
            localStorage.setItem(this.seedMigrationKey, 'done');
            return { exercises: existingExercises, addedCount: 0 };
        }

        localStorage.setItem(this.seedMigrationKey, 'done');
        return {
            exercises: [...existingExercises, ...missingById],
            addedCount: missingById.length
        };
    }

    /**
     * Initialize or get all exercises
     */
    getAllExercises() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Save all exercises
     */
    saveExercises(exercises) {
        localStorage.setItem(this.storageKey, JSON.stringify(exercises));
    }

    /**
     * Create a new exercise
     */
    createNewExercise() {
        const exercises = this.getAllExercises();
        const exercise = {
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            event: '',
            emotion: '',
            interpretation: '',
            realities: [],
            reflection: '',
            status: 'new' // new, in_progress, generated, completed
        };
        exercises.push(exercise);
        this.saveExercises(exercises);
        this.setCurrentExerciseId(exercise.id);
        return exercise;
    }

    /**
     * Get current exercise by ID
     */
    getExerciseById(id) {
        const exercises = this.getAllExercises();
        return exercises.find(ex => ex.id === id);
    }

    /**
     * Update exercise
     */
    updateExercise(id, updates) {
        const exercises = this.getAllExercises();
        const index = exercises.findIndex(ex => ex.id === id);
        
        if (index !== -1) {
            exercises[index] = {
                ...exercises[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveExercises(exercises);
            return exercises[index];
        }
        return null;
    }

    /**
     * Set current exercise ID
     */
    setCurrentExerciseId(id) {
        localStorage.setItem(this.currentExerciseKey, id);
    }

    /**
     * Get current exercise ID
     */
    getCurrentExerciseId() {
        return localStorage.getItem(this.currentExerciseKey);
    }

    /**
     * Get or create current exercise
     */
    getCurrentExercise() {
        const currentId = this.getCurrentExerciseId();
        let exercise;

        if (currentId) {
            exercise = this.getExerciseById(currentId);
        }

        // If no current exercise or it doesn't exist, create new one
        if (!exercise) {
            exercise = this.createNewExercise();
        }

        return exercise;
    }

    /**
     * Delete exercise
     */
    deleteExercise(id) {
        let exercises = this.getAllExercises();
        exercises = exercises.filter(ex => ex.id !== id);
        this.saveExercises(exercises);

        // If deleted current exercise, clear it
        if (this.getCurrentExerciseId() === id) {
            localStorage.removeItem(this.currentExerciseKey);
        }
    }

    /**
     * Get exercises for a specific date range
     */
    getExercisesForDateRange(filterType) {
        const exercises = this.getAllExercises();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return exercises.filter(ex => {
            const exDate = new Date(ex.createdAt);
            const exDateOnly = new Date(exDate.getFullYear(), exDate.getMonth(), exDate.getDate());

            switch(filterType) {
                case 'today':
                    return exDateOnly.getTime() === today.getTime();
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return exDateOnly >= weekAgo && exDateOnly <= today;
                case 'month':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return exDateOnly >= monthAgo && exDateOnly <= today;
                case 'all':
                default:
                    return true;
            }
        });
    }

    /**
     * Search exercises by keyword
     */
    searchExercises(keyword) {
        const exercises = this.getAllExercises();
        const lowerKeyword = keyword.toLowerCase();

        return exercises.filter(ex =>
            ex.event.toLowerCase().includes(lowerKeyword) ||
            ex.emotion.toLowerCase().includes(lowerKeyword) ||
            ex.interpretation.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return 'Today';
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
    }

    /**
     * Format time for display
     */
    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        
        return this.formatDate(dateString);
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const exercises = this.getAllExercises();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            total: exercises.length,
            today: exercises.filter(ex => new Date(ex.createdAt) >= today).length,
            completed: exercises.filter(ex => ex.status === 'completed').length,
            withReflection: exercises.filter(ex => ex.reflection && ex.reflection.trim().length > 0).length
        };

        return stats;
    }

    /**
     * Export exercises as JSON
     */
    exportAsJSON() {
        const exercises = this.getAllExercises();
        return JSON.stringify(exercises, null, 2);
    }

    /**
     * Import exercises from JSON
     */
    importFromJSON(jsonString) {
        try {
            const exercises = JSON.parse(jsonString);
            if (Array.isArray(exercises)) {
                this.saveExercises(exercises);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    /**
     * Clear all data (use with caution)
     */
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.currentExerciseKey);
        localStorage.removeItem(this.seedVersionKey);
        localStorage.removeItem(this.seedMigrationKey);
        localStorage.removeItem(this.demoIndexKey);
        localStorage.removeItem(this.demoModeKey);
    }
}

// Create global instance
const dataManager = new DataManager();
