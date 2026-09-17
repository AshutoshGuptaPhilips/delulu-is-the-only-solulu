# 🌟 Solulu - Reality Checks App

A therapeutic web application designed to help you challenge negative thought patterns and explore alternate perspectives on challenging situations.

## 📋 Overview

Solulu implements a Cognitive Behavioral Therapy (CBT) inspired exercise called "Reality Checks". It helps users:

1. **Describe** a challenging event or situation
2. **Identify** the emotions they're feeling
3. **Express** their raw interpretation of what will happen
4. **Generate** AI-powered alternate realities and perspectives
5. **Reflect** on how their thoughts have changed

## 🎯 Key Features

### Reality Checks Tab (Main Feature)
- **Input Section:** Three guided text areas for event description, emotion, and interpretation
- **Generate Button:** Beautiful animated button to create alternate realities
- **Output Section:** 4 different perspectives on the situation
  - AI interpretation of your thought pattern
  - Neutral/balanced perspective
  - Positive reframe
  - Contextual/systemic view
- **Reflection Section:** Expandable area to write fresh thoughts after reading realities

### Exercise Management
- **Auto-save:** Exercises are automatically saved to browser storage
- **View All Exercises:** Browse past exercises organized by date
- **Search & Filter:** Find exercises by date range or keyword
- **Status Tracking:** See which exercises are active or completed

### Additional Tabs (Coming Soon)
- Journal: Daily reflections and insights
- Progress: Track mood changes over time
- Settings: Customize app preferences

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Click on "Reality Checks" tab (already active)
3. Fill in the three text areas:
   - Describe the Event
   - Emotion Felt
   - Your Raw Interpretation
4. Click "Generate Alternate Realities"
5. Read the 4 generated perspectives
6. (Optional) Expand and fill the reflection section
7. Navigate back to view your exercise history

### No Installation Required
This is a pure HTML/CSS/JavaScript application. Simply open the `index.html` file in any modern browser.

## 📁 Project Structure

```
solulu/
├── index.html           # Main HTML structure
├── styles.css           # Complete CSS styling
├── app.js               # Main application logic
├── data.js              # Data management & localStorage
├── api.js               # Mock AI for generating realities
├── UX_DESIGN.md         # Complete UX design document
└── README.md            # This file
```

## 💾 Data Storage

All exercises are stored in your browser's **localStorage**:
- **Key:** `solulu_exercises` - Contains all exercises as JSON
- **Key:** `solulu_current_exercise` - Tracks the current exercise ID

**Note:** Data persists only in the same browser. Clearing browser cache will delete all exercises.

## 🤖 How the AI Works

The app uses a **mock AI system** (not connected to external APIs) that generates realistic alternate perspectives based on:

1. **AI Interpretation** - Analyzes your thought pattern and emotion
2. **Neutral Perspective** - Removes emotional bias, presents objective view
3. **Positive Reframe** - Explores optimistic possibilities
4. **Contextual View** - Considers larger systems and outside factors

Each reality includes psychological insights relevant to your situation.

### Switching to Real AI

To integrate with a real AI service (OpenAI, etc.):

1. Open `api.js`
2. Find the `generateRealities()` method
3. Replace mock generation with actual API call
4. Update the `useLocalMock` flag to `false`

Example template is already in the code.

## 🎨 User Interface

### Design Features
- **Modern gradient design** with teal and purple accents
- **Responsive layout** for desktop, tablet, and mobile
- **Smooth animations** and transitions
- **Accessible components** with WCAG AA compliance
- **Character counters** for each input field
- **Toast notifications** for user feedback

### Color Palette
- Primary: Teal (#0EA5E9)
- Secondary: Purple (#A855F7)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Background: Off-white (#F9FAFB)

## 🔧 Customization

### Modify Alternate Realities
Edit the arrays in `api.js`:
- `generateAIInterpretation()` - Change AI's interpretation templates
- `generateNeutralPerspective()` - Modify neutral view
- `generatePositivePerspective()` - Change positive reframe
- `generateContextualPerspective()` - Adjust systemic view

### Change Colors
Update CSS variables in `styles.css`:
```css
:root {
    --primary: #0ea5e9;
    --secondary: #a855f7;
    --success: #10b981;
    /* ... etc */
}
```

### Add More Tabs
1. Add new button in `.nav-tabs` section (index.html)
2. Add corresponding `<section>` in content area
3. Add click handler in `app.js`

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+ - Full layout with sidebar
- **Tablet:** 768px - 1199px - Adjusted spacing
- **Mobile:** < 768px - Single column, hamburger menu

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Clear focus indicators
- Color contrast (WCAG AA)
- Readable font sizes

## 🔒 Security & Privacy

- **No backend server** - All data stays in your browser
- **No tracking** - No analytics or data collection
- **No internet required** (except for optional AI API)
- **Encryption:** Not applicable (local storage only)

## 🐛 Troubleshooting

### Exercises not saving?
- Check if localStorage is enabled in your browser
- Clear browser cache might clear saved data
- Check browser console (F12) for errors

### Generation taking too long?
- The mock AI has a 2-second delay
- Real API integration may take longer
- Check internet connection if using real API

### Styles not loading?
- Ensure `styles.css` is in the same folder as `index.html`
- Clear browser cache and refresh
- Check file paths are correct

## 📖 Usage Tips

1. **Be Specific:** The more detailed your description, the better the realities
2. **Be Honest:** Describe your true feelings, not what you think you "should" feel
3. **Read All Perspectives:** Take time with each reality, don't rush
4. **Reflect Genuinely:** Use the reflection to process what you've read
5. **Repeat:** Regular practice helps rewire thought patterns

## 🎓 CBT Background

This app is inspired by Cognitive Behavioral Therapy (CBT) techniques:

- **Thought Records:** Structured way to examine thoughts
- **Cognitive Distortions:** Recognizing thought pattern biases
- **Thought Challenging:** Developing alternative perspectives
- **Behavioral Experiments:** Testing beliefs through actions

This is **not professional therapy** and should complement, not replace, work with a therapist.

## 🚀 Future Enhancements

- [ ] Real AI integration (OpenAI API)
- [ ] Export to PDF
- [ ] Progress analytics dashboard
- [ ] Mobile app version
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Sharing with therapist
- [ ] Mood tracking integration
- [ ] Scheduled reminders
- [ ] Community insights

## 📄 License

This project is open-source and available for personal use.

## 💬 Feedback

For suggestions or bug reports, please create an issue or contact the developer.

## 🙏 Acknowledgments

Built with inspiration from CBT principles and designed to make mental health support accessible to everyone.

---

**Made with ❤️ for mental wellness**

Version 1.0 - September 2026
