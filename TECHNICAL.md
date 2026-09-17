# 🔧 Technical Documentation - Solulu

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│          index.html (UI Layer)              │
│     - DOM structure                         │
│     - Form inputs                           │
│     - Modal containers                      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│       app.js (Application Logic)            │
│     - Event handlers                        │
│     - UI state management                   │
│     - User interactions                     │
└────────────────┬────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼────────┐    ┌──────▼──────────┐
│   data.js    │    │    api.js       │
│(Persistence) │    │  (AI Engine)    │
└──────────────┘    └─────────────────┘
      │                     │
      └──────────┬──────────┘
                 │
        localStorage + Mock AI
```

## File-by-File Breakdown

### 1. `index.html` - Structure (562 lines)

**Purpose:** Define all DOM elements and page structure

**Key Sections:**
- **Header** - Logo and user menu
- **Sidebar** - Navigation tabs
- **Main Content** - Tab sections for features
- **Modals** - Exercise list modal
- **Toast Container** - Notification area
- **Loading Overlay** - Generation loading state

**Important IDs:**
```
Input Fields:
- eventInput, emotionInput, interpretationInput
- reflectionInput

Buttons:
- generateBtn, viewAllBtn, reflectionToggle
- backBtn, saveReflectionBtn

Containers:
- outputSection, realitiesContainer
- exercisesModal, exercisesList
```

### 2. `styles.css` - Styling (900+ lines)

**Purpose:** Complete visual design and responsiveness

**Structure:**
1. **Global Reset & Variables** - CSS custom properties
2. **Layout** - Flexbox structure for app container
3. **Header & Sidebar** - Navigation styling
4. **Forms** - Input field styling
5. **Buttons** - All button states and animations
6. **Cards** - Reality card styling
7. **Modal** - Modal styling and animations
8. **Responsive** - Media queries for mobile
9. **Animations** - @keyframes for transitions

**Color System:**
```css
--primary: #0ea5e9 (Teal)
--secondary: #a855f7 (Purple)
--success: #10b981 (Green)
--error: #ef4444 (Red)
--background: #f9fafb (Light)
--surface: #ffffff (White)
--border: #e5e7eb (Gray)
--text-primary: #1f2937 (Dark)
--text-secondary: #6b7280 (Medium)
--text-muted: #9ca3af (Light)
```

**Key Animations:**
- `fadeIn` - Element appearance
- `slideIn` - Card entrance
- `spin` - Loading spinner
- `slideInRight` - Toast notification

**Responsive Breakpoints:**
- Desktop: 1200px+
- Tablet: 768-1199px
- Mobile: <768px

### 3. `data.js` - Data Management (300+ lines)

**Class:** `DataManager`

**Key Methods:**

```javascript
// Exercise CRUD
createNewExercise()         // Create & save new exercise
getExerciseById(id)         // Retrieve specific exercise
updateExercise(id, updates) // Save changes
deleteExercise(id)          // Remove exercise

// Current Exercise
getCurrentExercise()        // Get/create current exercise
setCurrentExerciseId(id)    // Set active exercise
getCurrentExerciseId()      // Get active exercise ID

// Querying
getAllExercises()           // Fetch all exercises
searchExercises(keyword)    // Search by text
getExercisesForDateRange(type) // Filter by date
getStatistics()             // Get usage stats

// Utilities
formatDate(dateString)      // Convert to readable date
formatTime(dateString)      // Convert to readable time
getRelativeTime(dateString) // "2 hours ago" format
generateId()                // Create unique ID

// Import/Export
exportAsJSON()              // Download all data
importFromJSON(json)        // Upload all data
clearAllData()              // Reset everything
```

**Data Structure:**

```javascript
// Individual Exercise Object
{
  id: "exercise_1694784000000_abc123def456",
  createdAt: "2026-09-15T14:30:00.000Z",
  updatedAt: "2026-09-15T14:35:00.000Z",
  event: "My boss criticized me in the team meeting",
  emotion: "anxious, insecure",
  interpretation: "Everyone thinks I'm incompetent. I'll be fired.",
  realities: [ /* array of reality objects */ ],
  reflection: "Actually, maybe I was just having a bad day...",
  status: "completed" // new, in_progress, generated, completed
}
```

**Storage:**
- Key: `solulu_exercises` (Array of all exercises)
- Key: `solulu_current_exercise` (Current exercise ID)
- Uses browser's `localStorage` API
- Max ~5-10MB per browser

### 4. `api.js` - AI Engine (400+ lines)

**Class:** `AIReality`

**Key Methods:**

```javascript
// Main generation method (async)
generateRealities(event, emotion, interpretation)
  // Returns Promise with 4 realities

// Individual reality generators
generateAIInterpretation(...)      // AI's analysis
generateNeutralPerspective(...)    // Objective view
generatePositivePerspective(...)   // Optimistic view
generateContextualPerspective(...) // Systems view

// Utilities
validateInputs(e, em, i)   // Check form validity
getEmotionPattern(emotion) // Identify thought distortion
getRandomElement(array)    // Randomize content
formatReality(reality)     // Prepare for display
```

**Reality Object Structure:**

```javascript
{
  id: 1,
  title: "AI Interpretation of Your Thought",
  type: "ai_interpretation", // or "alternate"
  content: "Based on your description...",
  isAIInterpretation: true   // For styling
}
```

**Emotion Patterns Detected:**

```javascript
'anxiety/anxious/worry' → 'catastrophic thinking'
'sad/depressed' → 'hopelessness bias'
'angry/furious' → 'blame attribution'
'insecure/doubt' → 'self-doubt amplification'
'shame/embarrassed' → 'social threat perception'
// default → 'emotional filtering'
```

**Switching to Real AI:**

```javascript
// In AIReality constructor
this.useLocalMock = false; // Set to false

// Implement real API call
async generateRealities(event, emotion, interpretation) {
  const response = await fetch(this.apiEndpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [/* your prompt */]
    })
  });
  return await response.json();
}
```

### 5. `app.js` - Main Application (700+ lines)

**Class:** `SoluluApp`

**Lifecycle:**
1. `constructor()` - Call init()
2. `init()` - Setup cache, load, attach listeners
3. `attachEventListeners()` - Register all event handlers
4. Event handlers execute
5. `autoSaveExercise()` - Save changes

**Key Methods:**

```javascript
// Initialization
init()                  // Main setup
cacheElements()         // Preload DOM refs
attachEventListeners()  // Register handlers

// Exercise Management
loadCurrentExercise()       // Load active exercise
createNewExercise()         // New blank exercise
populateFormWithExercise()  // Fill form from data
autoSaveExercise()          // Auto-save on change

// Generation Flow
handleGenerate()           // Click handler
displayRealities()         // Show results
createRealityCard(r, idx)  // Build card DOM

// Reflection
toggleReflection()         // Expand/collapse
saveReflection()          // Save user reflection

// Exercise List
openExercisesModal()       // Show modal
closeExercisesModal()      // Hide modal
loadExercisesList()        // Load exercises
displayExercisesList()     // Render list
selectExercise(id)         // Switch exercise
groupExercisesByDate()     // Organize by date

// Search & Filter
filterExercises()          // Apply filters
// (search input integrated)

// UI Updates
updateTimestamp()          // Update time display
checkIfHasRealities()      // Check for output
updateCharCount(...)       // Update char counter
switchTab(tabButton)       // Change tabs

// Utilities
showToast(message, type)   // Notification
copyToClipboard(text)      // Copy action
escapeHtml(text)           // Prevent XSS
```

**Event Flow Example:**

```
User types in eventInput
    ↓
'input' event fires
    ↓
app.updateCharCount() executes
    ↓
Character counter updates
    ↓
(debounced) autoSaveExercise() calls
    ↓
dataManager.updateExercise() saves
    ↓
Exercise updated in localStorage
```

**State Management:**

```javascript
this.currentExercise // Active exercise object
this.allExercises    // Cached all exercises
this.isGenerating    // Flag during AI call
```

---

## Common Development Tasks

### Task 1: Add a New Input Field

1. **HTML** (index.html):
```html
<div class="input-group">
  <label for="newInput" class="input-label">New Field</label>
  <textarea id="newInput" class="input-field"></textarea>
</div>
```

2. **CSS** (styles.css):
Already covered by `.input-group` and `.input-field`

3. **JavaScript** (app.js):
```javascript
// In cacheElements()
this.newInput = document.getElementById('newInput');

// In setupCharacterCounters()
this.updateCharCount('newInput', 'newCount');

// In autoSaveExercise()
newField: this.newInput.value,
```

### Task 2: Add a New Tab

1. **HTML** - Add button and content section
2. **CSS** - Already responsive
3. **JavaScript** - Event listener already handles it

### Task 3: Customize Reality Responses

Edit `api.js` - Modify template arrays:

```javascript
generateAIInterpretation(event, emotion, interpretation) {
  const interpretations = [
    `Your new template here: "${event}"...`
  ];
  return this.getRandomElement(interpretations);
}
```

### Task 4: Change Colors

Edit `styles.css` CSS variables:

```css
:root {
  --primary: #YOUR_COLOR;
  --secondary: #YOUR_COLOR;
  /* ... etc */
}
```

### Task 5: Add Validation

```javascript
// In app.js handleGenerate()
if (event.length < 10) {
  this.showToast('Event must be at least 10 characters', 'error');
  return;
}
```

---

## Performance Considerations

### Current Performance:
- **Load Time:** <100ms
- **Generation Time:** 2000ms (mock AI delay)
- **Storage:** ~2KB per exercise
- **Memory:** ~1MB typical usage

### Optimization Tips:

1. **Lazy Load Exercises:**
```javascript
// Only load 20 at a time
getExercisesForDateRange(type, limit = 20) { ... }
```

2. **Paginate Results:**
```javascript
displayExercisesList(exercises, page = 1) {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  // ... slice and display
}
```

3. **Debounce Auto-Save:**
```javascript
autoSaveExercise() {
  clearTimeout(this.saveTimeout);
  this.saveTimeout = setTimeout(() => {
    dataManager.updateExercise(...);
  }, 1000); // Wait 1s after last change
}
```

---

## Testing Guide

### Manual Testing Checklist:

- [ ] Create new exercise
- [ ] Fill all three inputs
- [ ] Generate realities
- [ ] Read all 4 realities
- [ ] Expand reflection
- [ ] Save reflection
- [ ] Go back to list
- [ ] View all exercises
- [ ] Search exercises
- [ ] Filter by date
- [ ] Select past exercise
- [ ] Edit and resave
- [ ] Clear browser cache
- [ ] Use on mobile
- [ ] Test in different browser

### Browser Testing:

```bash
# Chrome DevTools
F12 → Console → Check for errors

# Firefox DevTools
F12 → Console → Check for errors

# Safari
Cmd+Opt+I → Console

# Responsive Design
F12 → Toggle device toolbar
Test: 320px, 768px, 1200px widths
```

---

## Debugging

### Enable Debug Logging:

```javascript
// In app.js, add at top:
const DEBUG = true;

// Replace log calls:
if (DEBUG) console.log('Exercise loaded:', this.currentExercise);
```

### Check Storage:

```javascript
// Browser console:
localStorage.getItem('solulu_exercises')
localStorage.getItem('solulu_current_exercise')

// Clear storage:
localStorage.clear()
```

### Network Issues:

```javascript
// In api.js, add timing:
const start = Date.now();
await generateRealities(...);
console.log('Generated in:', Date.now() - start, 'ms');
```

---

## Deployment Options

### Option 1: GitHub Pages (Free)
1. Push to GitHub
2. Enable Pages in settings
3. Site available at `yourusername.github.io/solulu`

### Option 2: Netlify (Free)
1. Drag & drop folder to netlify.com
2. Site deployed instantly
3. Get free HTTPS

### Option 3: Web Server
1. Upload files via FTP
2. Point domain
3. Host anywhere

### Option 4: Docker
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

---

## API Integration Example

When ready to add real AI:

```javascript
// In api.js
async generateRealities(event, emotion, interpretation) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'You are a CBT therapist...',
      }, {
        role: 'user',
        content: `Event: ${event}\nEmotion: ${emotion}\nInterpretation: ${interpretation}`
      }]
    })
  });
  
  const data = await response.json();
  return parseResponse(data.choices[0].message.content);
}
```

---

## Accessibility Standards

Compliance with:
- **WCAG 2.1 Level AA**
- **ADA (Americans with Disabilities Act)**
- **WCAG Color Contrast Ratio:** 4.5:1

### Key A11y Features:
- Semantic HTML (`<button>`, `<label>`, `<textarea>`)
- ARIA labels where needed
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators visible
- Alt text for icons
- Font sizes ≥16px mobile
- Touch targets ≥44px

---

## Version History

**v1.0** - September 2026
- Initial release
- Core Reality Checks feature
- Exercise management
- Mock AI engine
- localStorage persistence

**v1.1** (Planned)
- Real AI integration
- Progress dashboard
- Journal feature
- Dark mode
- Mobile app

---

## Support & Contribution

For technical issues or improvements, refer to the main README.md

---

**Last Updated:** September 15, 2026  
**Maintained by:** Solulu Team
