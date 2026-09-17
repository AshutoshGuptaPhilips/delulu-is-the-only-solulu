/* ============================================
   SOLULU - Data Management
   Handles localStorage and data persistence
   ============================================ */

class DataManager {
    constructor() {
        this.storageKey = 'solulu_exercises';
        this.currentExerciseKey = 'solulu_current_exercise';
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
    }
}

// Create global instance
const dataManager = new DataManager();
