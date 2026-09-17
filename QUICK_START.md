# 🚀 Quick Start Guide - Solulu

## How to Launch the App

### Option 1: Direct File Open
1. Navigate to the solulu folder
2. Right-click on `index.html`
3. Select "Open with" → Your browser (Chrome, Firefox, Safari, Edge)

### Option 2: Drag & Drop
1. Drag `index.html` into your browser window

### Option 3: Via Command Line
```bash
# Navigate to solulu folder
cd "c:\Users\320157462\OneDrive - Philips\Documents\solulu"

# Open in default browser (Windows)
start index.html

# Open in default browser (Mac)
open index.html

# Open in default browser (Linux)
xdg-open index.html
```

### Option 4: Local Server (Recommended)
```bash
# If you have Python 3 installed
python -m http.server 8000

# If you have Python 2
python -m SimpleHTTPServer 8000

# Then open: http://localhost:8000/index.html
```

---

## 5-Minute Tutorial

### Step 1: Start (30 seconds)
- App opens with a **fresh new exercise**
- You see three labeled text boxes

### Step 2: Describe Event (1 minute)
Enter in the first box: **"What happened?"**
- Example: "My manager gave me critical feedback in front of the team"
- Be specific and objective
- Use 1-3 sentences

### Step 3: Name Your Emotion (30 seconds)
Enter in the second box: **"What did you feel?"**
- Examples: anxious, sad, insecure, angry, embarrassed
- Be honest about the emotion
- You can name multiple emotions

### Step 4: Write Your Interpretation (1 minute)
Enter in the third box: **"What do you think will happen?"**
- Example: "Everyone now thinks I'm incompetent. I'll be fired. My career is ruined."
- Write your raw, unfiltered thoughts
- This is your catastrophic prediction

### Step 5: Generate (2 minutes)
- Click the **blue gradient button** "✨ Generate Alternate Realities"
- Wait ~2 seconds for AI to generate
- You'll see 4 different perspectives on your situation

### Step 6: Read & Reflect (1-2 minutes)
- **Reality 1:** AI's analysis of your thought pattern
- **Reality 2-4:** Other possible perspectives
- Read each one carefully
- Notice if any make sense or feel different

### Step 7: Optional - Add Reflection
- Click **"Expand to Add Your Reflection"**
- Write: How do you feel NOW after reading these?
- Click **"Save Reflection"**

### Step 8: Continue or Review
- Click **"View All Exercises"** to see past exercises
- Click **"New Exercise"** to practice again

---

## Features Overview

### 🔍 Reality Checks (Main Tab)
- Input your situation, emotion, and interpretation
- Generate 4 alternate perspectives
- Add personal reflection
- Auto-saves as you type

### 👀 View All Exercises
- Click the button at top right
- See all past exercises organized by date
- Search by keywords
- Filter by date range
- Click any exercise to continue working on it

### 💾 Auto-Save
- Everything saves automatically
- No need to click save buttons
- Even works if you close the browser

### 💭 Other Tabs (Coming Soon)
- **Journal:** Daily reflections
- **Progress:** Track mood over time
- **Settings:** Customize preferences

---

## What Each Generated Reality Shows You

### Reality 1: AI Interpretation
**What it does:** Shows you how an AI system sees your thought pattern
- Points out emotional biases
- Explains why your brain thinks this way
- Validates your feelings while questioning predictions

### Reality 2: Neutral Perspective
**What it does:** Removes emotional coloring
- What would an objective observer say?
- What are other explanations?
- Why might you be overestimating the threat?

### Reality 3: Positive Reframe
**What it does:** Explores optimistic possibilities
- What if this leads somewhere good?
- What opportunities might emerge?
- Why might you be underestimating yourself?

### Reality 4: Contextual View
**What it does:** Zooms out to see the bigger picture
- What other systems are at play?
- How much is actually in your control?
- What will this look like in a month? A year?

---

## Tips for Better Results

### Do This:
✅ Be specific with descriptions  
✅ Write your honest catastrophic thoughts  
✅ Take time reading each reality  
✅ Use this regularly (builds skills over time)  
✅ Combine with journaling or therapy  

### Don't Do This:
❌ Write vague descriptions  
❌ Minimize your real feelings  
❌ Rush through reading realities  
❌ Expect instant mood changes  
❌ Use as replacement for therapy  

---

## Data Storage

All your exercises are saved locally in your browser.

### What Gets Saved?
- Event description
- Emotion felt
- Your interpretation
- Generated realities
- Your reflection
- When it was created

### How to Access Your Data?
```javascript
// Open browser console (F12)
// Type this to see all exercises:
localStorage.getItem('solulu_exercises')
```

### How to Backup?
```javascript
// Copy this to your computer:
JSON.parse(localStorage.getItem('solulu_exercises'))
```

### ⚠️ Important Notes:
- Data stored **locally in your browser only**
- Clearing browser cache = lose all data
- Different browsers = different data
- No account needed
- No data sent to server

---

## Keyboard Shortcuts (Coming Soon)

| Key | Action |
|-----|--------|
| `Ctrl+Enter` | Generate Realities |
| `Ctrl+N` | New Exercise |
| `Ctrl+S` | Save Reflection |
| `Esc` | Close Modal |

---

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Excellent | Recommended |
| Firefox | ✅ Excellent | Works great |
| Safari | ✅ Excellent | iOS & Mac |
| Edge | ✅ Excellent | Modern versions |
| IE 11 | ❌ Not supported | Too old |

---

## Common Questions

### Q: Will my data be private?
**A:** Yes! Everything stays in your browser. Nothing is sent anywhere.

### Q: Can I use this on my phone?
**A:** Yes! The app is fully responsive. Just open the file in your phone's browser.

### Q: What if I clear my browser cache?
**A:** Your exercises will be deleted. Export them first if you want to keep them.

### Q: Can multiple people use the same browser?
**A:** No - all exercises will be mixed. Each person should use a different browser profile.

### Q: How is this different from a journal?
**A:** This focuses on *examining* thoughts, not just recording them. It shows you alternative perspectives to challenge your thinking.

### Q: Is this therapy?
**A:** No. This is a self-help tool inspired by CBT. It should complement therapy, not replace it.

### Q: Can I share exercises with my therapist?
**A:** Currently you can copy/paste. Full sharing features coming soon.

---

## Troubleshooting

### App won't load?
- [ ] Make sure all files are in the same folder
- [ ] Try refreshing the page (Ctrl+R or Cmd+R)
- [ ] Clear browser cache
- [ ] Try a different browser
- [ ] Check browser console (F12) for errors

### Exercises not saving?
- [ ] Check if localStorage is enabled (Settings → Privacy)
- [ ] Try in a different browser
- [ ] Make sure you're not in private/incognito mode
- [ ] Check you have storage space

### Generation taking forever?
- [ ] Network timeout? Try again
- [ ] Reload the page
- [ ] Close other tabs using memory

### Looks broken/colors wrong?
- [ ] Clear cache and refresh
- [ ] Try Ctrl+Shift+R (hard refresh)
- [ ] Check internet connection
- [ ] Try different browser zoom (Ctrl+0)

---

## Next Steps

1. **Complete your first exercise** (5 minutes)
2. **Read through each reality carefully** (2-3 times)
3. **Notice what changed in your thinking**
4. **Practice with new situations** (daily)
5. **Review past exercises** for patterns
6. **Share insights** with therapist/journal

---

## Getting Support

- **Not sure what to write?** Look at the example text
- **Want more info?** Read UX_DESIGN.md for full details
- **Having technical issues?** Check README.md troubleshooting
- **Want to customize?** Edit api.js or styles.css

---

## About Reality Checks

This exercise is based on **Cognitive Behavioral Therapy (CBT)**, which helps by:

1. **Identifying** automatic negative thoughts
2. **Examining** the evidence for/against them
3. **Developing** alternative perspectives
4. **Behaving** differently based on new thinking

Over time, this practice literally rewires your brain's default response patterns.

---

**You've got this! Start your first Reality Check now. 🌟**

---

*Version 1.0 - September 2026*  
*For questions or feedback, see README.md*
