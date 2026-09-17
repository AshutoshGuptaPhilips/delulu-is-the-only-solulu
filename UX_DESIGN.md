# Solulu - Reality Checks App
## UX Design Document

---

## 1. Application Overview

**Name:** Solulu  
**Primary Feature:** Reality Checks - A cognitive behavioral therapy (CBT) inspired tool to help users examine and challenge their thoughts by generating alternate interpretations of situations.

**Core Value Proposition:** Help users break negative thought patterns by exploring multiple perspectives on their situation.

---

## 2. Visual Architecture

### 2.1 Main Application Layout

```
┌─────────────────────────────────────────────────────────┐
│  SOLULU                                    [User Menu]   │
├──────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ Reality  │ │ Journal  │ │ Progress │ │ Settings │    │
│ │ Checks   │ │          │ │          │ │          │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
├──────────────────────────────────────────────────────────┤
│                   [Main Content Area]                    │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Reality Checks Tab - Main View

```
┌────────────────────────────────────────────────────────────┐
│  REALITY CHECKS                   [View All Exercises ▼]   │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  NEW EXERCISE - Started Today at 2:30 PM            │   │
│  │  [Auto-saves]                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ INPUT SECTION ─────────────────────────────────────┐   │
│  │                                                      │   │
│  │ 1. DESCRIBE THE EVENT                              │   │
│  │    [___________________________________]            │   │
│  │    What happened? Be specific and objective.        │   │
│  │                                                      │   │
│  │ 2. EMOTION FELT                                    │   │
│  │    [___________________________________]            │   │
│  │    e.g., sad, happy, insecure, anxious             │   │
│  │                                                      │   │
│  │ 3. YOUR INTERPRETATION                            │   │
│  │    [___________________________________]            │   │
│  │    What do you think will happen next and why?     │   │
│  │                                                      │   │
│  │                  [GENERATE ALTERNATE REALITIES]    │   │
│  │                     (Fancy Button Design)          │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ OUTPUT SECTION ────────────────────────────────────┐   │
│  │                                                      │   │
│  │  ✓ GENERATED ALTERNATE REALITIES                   │   │
│  │                                                      │   │
│  │  Reality 1: AI Interpretation of Your Thought      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ Based on what you described, here's what   │    │   │
│  │  │ might actually be happening...             │    │   │
│  │  │                                             │    │   │
│  │  │ [AI-generated interpretation]              │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  Reality 2: Alternate Perspective A                │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ [AI-generated alternate reality]           │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  Reality 3: Alternate Perspective B                │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ [AI-generated alternate reality]           │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  Reality 4: Alternate Perspective C                │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ [AI-generated alternate reality]           │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌─ REFLECTION [Disabled/Minimized by Default] ─┐  │   │
│  │  │ ▼ Expand to Add Your Reflection             │  │   │
│  │  │ After reading these realities, how do you   │  │   │
│  │  │ feel now? Have your thoughts changed?       │  │   │
│  │  │                                              │  │   │
│  │  │ [Text box - enabled when clicked]            │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [← Back to Exercises]                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 3. View All Exercises Modal/Screen

```
┌────────────────────────────────────────────────────────────┐
│  MY EXERCISES                              [New Exercise]   │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  SEARCH: [_____________________]  FILTER: [Date ▼]         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Today                                              │   │
│  │  ├─ Exercise 1 (Started 2:30 PM)        [Active]   │   │
│  │  │  "My boss gave me feedback in the team meeting" │   │
│  │  │                                                  │   │
│  │  └─ Exercise 2 (Started 10:15 AM)       [Complete] │   │
│  │     "I made a mistake during presentation"         │   │
│  │                                                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Yesterday                                          │   │
│  │  ├─ Exercise 3 (Started 5:00 PM)        [Complete] │   │
│  │  │  "Friend didn't reply to my message"           │   │
│  │  │                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  SORT BY: [Date ▼]  VIEW: [List ▼] [Compact]              │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Key UI Components

### 4.1 Input Text Boxes

**Style:** 
- Soft, modern design with subtle borders
- Light background (off-white or light gray)
- Clear labels with icons
- Helper text below each field
- Character counter (optional)
- Focus state: border color change + subtle glow

**Example:**
```
┌─ 📝 DESCRIBE THE EVENT ─────────────────────────┐
│                                                   │
│ [_________________________________]              │
│                                                   │
│ Be specific and objective about what happened.   │
│ 0 / 500 characters                              │
└───────────────────────────────────────────────────┘
```

### 4.2 Generate Button - Fancy Design

**Style:** 
- Gradient background (blue → purple or teal → blue)
- Animated on hover (scale, glow effect)
- Loading state with spinner animation
- Icon + text: "✨ Generate Alternate Realities"
- Medium-large size to draw attention
- Smooth rounded corners
- Disabled state when inputs are incomplete

**States:**
```
NORMAL:        [✨ Generate Alternate Realities]
HOVER:         [✨ Generate Alternate Realities] (glowing)
LOADING:       [⟳ Generating...] (spinner)
SUCCESS:       [✓ Generated] (brief flash)
DISABLED:      [✨ Generate Alternate Realities] (grayed out)
```

### 4.3 Reality Cards

**Style:**
- Organized in a vertical stack (1 per reality)
- Card design with shadow/elevation
- Number badge (Reality 1, 2, 3, 4)
- Title describing the perspective
- Content area with readable typography
- Subtle background color (different for AI interpretation vs others)
- Copy-to-clipboard button
- Collapse/expand for longer content

**Reality 1 (AI Interpretation) - Highlighted:**
```
┌────────────────────────────────────────────────┐
│  ①  AI Interpretation of Your Thought         │
│                                                 │
│  Based on your description, here's what might  │
│  actually be happening...                      │
│                                                 │
│  [AI-generated content]                        │
│                                                 │
│  [Copy] [Save] [Share]                        │
└────────────────────────────────────────────────┘
```

**Reality 2-4 (Alternatives) - Neutral Style:**
```
┌────────────────────────────────────────────────┐
│  ②  Alternate Perspective: [Title]            │
│                                                 │
│  [AI-generated content]                        │
│                                                 │
│  [Copy] [Save] [Share]                        │
└────────────────────────────────────────────────┘
```

### 4.4 Reflection Section (Expandable)

**State 1 - Minimized (Default):**
```
┌────────────────────────────────────────────────┐
│ ▼ Expand to Add Your Reflection                │
│   After reading these realities, how do you    │
│   feel now? Have your thoughts changed?        │
└────────────────────────────────────────────────┘
```

**State 2 - Expanded:**
```
┌────────────────────────────────────────────────┐
│ ▲ Your Reflection                              │
│                                                 │
│ After reading these realities, how do you feel │
│ now? Have your thoughts changed?               │
│                                                 │
│ [____________________________________]         │
│ [____________________________________]         │
│ [____________________________________]         │
│ [____________________________________]         │
│                                                 │
│ 0 / 500 characters                            │
│                                  [Save Reflection] │
└────────────────────────────────────────────────┘
```

---

## 5. User Flows

### 5.1 Primary Flow: Complete a Reality Check Exercise

```
User Opens App
    ↓
Reality Checks Tab (Active)
    ↓
New Exercise Opens (Auto-loaded)
    ↓
Fill Input 1: Event Description
    ↓
Fill Input 2: Emotion Felt
    ↓
Fill Input 3: Raw Interpretation
    ↓
Click "Generate Alternate Realities"
    ↓
Loading... (Show spinner)
    ↓
4 Realities Generated
    ↓
Read & Review
    ↓
(Optional) Expand & Fill Reflection
    ↓
Click Back or Close
    ↓
Auto-Save Exercise
    ↓
Return to Exercise List
```

### 5.2 Secondary Flow: View Past Exercises

```
User Clicks "View All Exercises"
    ↓
Exercise List Screen Opens
    ↓
Can Filter/Search Exercises
    ↓
Click on Exercise
    ↓
View Exercise Details
    ↓
Can Re-read or Edit (if active)
    ↓
Return to List or New Exercise
```

---

## 6. Data States

### 6.1 Exercise States

1. **NEW** - Just created, no generations yet
2. **IN_PROGRESS** - Input filled, ready to generate
3. **LOADING** - Generating alternate realities
4. **GENERATED** - Realities created, user can read
5. **COMPLETED** - Reflection added (optional)
6. **SAVED** - Auto-saved when leaving

### 6.2 Validation States

- Input fields: Required before generation
- Button: Disabled until all inputs filled
- Generation: Loading state with feedback
- Error: Show helpful error messages if AI generation fails

---

## 7. Interaction Patterns

### 7.1 Validation & Error Handling

```
User Clicks Generate without filling all fields:
    ↓
"Please fill in all three fields to continue" (Toast)
    ↓
Highlight empty fields with red border

AI Generation Fails:
    ↓
"Unable to generate. Please try again." (Toast)
    ↓
[Retry] button appears
```

### 7.2 Auto-Save Behavior

- Auto-save when user leaves the exercise
- Show "Saving..." indicator briefly
- Show "Saved ✓" confirmation
- No data loss when user navigates away

### 7.3 Empty States

```
First Time Using:
    ├─ Onboarding tooltip showing the 3 input fields
    ├─ Friendly message explaining the purpose
    └─ [Start Your First Exercise]

No Results in Exercise List:
    ├─ Icon + message "You haven't created any exercises yet"
    └─ [Create First Exercise]
```

---

## 8. Color Scheme & Typography

### 8.1 Color Palette

- **Primary:** Teal / Deep Blue (#0EA5E9 or #2563EB)
- **Accent:** Purple (#A855F7)
- **Success:** Green (#10B981)
- **Warning/Error:** Red (#EF4444)
- **Background:** Off-white / Light Gray (#F9FAFB)
- **Text:** Dark Gray (#1F2937)
- **Borders:** Light Gray (#E5E7EB)

### 8.2 Typography

- **Headlines:** Bold, 24-28px
- **Subheadings:** Semi-bold, 18-20px
- **Body:** Regular, 14-16px
- **Helper text:** Regular, 12-13px, muted color
- **Font Family:** Modern sans-serif (e.g., Inter, SF Pro Display)

### 8.3 Spacing & Layout

- Padding: 16px, 24px, 32px (multiples of 8)
- Gap between sections: 24-32px
- Card padding: 20-24px
- Mobile-friendly responsive design

---

## 9. Responsive Design

### 9.1 Desktop (1200px+)
- Full sidebar with tabs visible
- Exercise list and detail side-by-side (optional)
- Full-width input and output sections

### 9.2 Tablet (768px - 1199px)
- Tabs may stack or be in hamburger menu
- Full-width content
- Touch-friendly buttons and inputs

### 9.3 Mobile (< 768px)
- Full-screen single column
- Hamburger menu for navigation
- Larger touch targets (44px minimum)
- Simplified card layout
- Bottom sheet or modal for exercise list

---

## 10. Micro-interactions

### 10.1 Animations

- **Button Hover:** Subtle scale (1.02x) + shadow increase
- **Generation:** 3-step spinner animation
- **Card Reveal:** Staggered fade-in (0.3s interval)
- **Reflection Expand:** Smooth height transition
- **Page Transitions:** Subtle fade or slide

### 10.2 Feedback

- Loading spinners during AI generation
- Toast notifications for actions (saved, errors)
- Skeleton screens while loading
- Character counters updating in real-time
- Focus states on all interactive elements

---

## 11. Accessibility (A11y)

- **Keyboard Navigation:** Tab through all inputs, buttons, cards
- **Screen Readers:** Semantic HTML, ARIA labels
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Clear, visible on all elements
- **Form Labels:** Clear associations with inputs
- **Error Messages:** Descriptive and linked to fields

---

## 12. User Journey Summary

1. **Discover:** User learns about Reality Checks
2. **Engage:** User fills out the 3 input fields
3. **Generate:** AI creates 4 alternate realities
4. **Reflect:** User reviews and optionally adds reflection
5. **Save:** Exercise auto-saves
6. **Repeat:** User can access past exercises or create new ones

---

## 13. Feature Roadmap (Future Enhancements)

- **Export:** Download exercises as PDF
- **Analytics:** Track mood improvements over time
- **Sharing:** Share specific realities with therapist/friend
- **Templates:** Pre-filled prompts for common scenarios
- **Notifications:** Reminders to practice exercises
- **Community:** Anonymized shared insights
- **Mobile App:** Native iOS/Android versions

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-15  
**Status:** Ready for Development
