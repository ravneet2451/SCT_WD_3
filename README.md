# Interactive Quiz Game Application

A comprehensive, interactive multiple-choice quiz game that supports various question types and provides detailed feedback to users.

## Features

### 🎯 Multiple Question Types
- **Multiple Choice**: Traditional single-answer questions
- **Multiple Select**: Questions with multiple correct answers
- **Fill in the Blank**: Text input questions
- **True/False**: Binary choice questions

### 🎮 Interactive Features
- **Progress Tracking**: Visual progress bar and question counter
- **Real-time Validation**: Instant feedback on answer selection
- **Score Calculation**: Comprehensive scoring system
- **Performance Analysis**: Detailed breakdown of results
- **Answer Review**: Review all questions with explanations

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Engaging transitions and effects
- **Intuitive Navigation**: Easy-to-use interface
- **Keyboard Support**: Navigate with Enter key
- **Visual Feedback**: Color-coded results and hover effects

### 📚 Quiz Categories
- **General Knowledge**: Mixed topics and facts
- **Science & Technology**: Scientific concepts and tech knowledge
- **Mixed Question Types**: Variety of question formats

## File Structure

```
SCT_TASK3/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling and responsive design
├── script.js       # Quiz game logic and functionality
└── README.md       # Project documentation
```

## How to Use

1. **Open the Application**: Open `index.html` in a web browser
2. **Select Quiz Type**: Choose from General Knowledge, Science & Technology, or Mixed Types
3. **Start Quiz**: Click "Start Quiz" to begin
4. **Answer Questions**: Select answers based on question type:
   - Click one option for multiple choice
   - Select multiple checkboxes for multiple select
   - Type answer for fill-in-the-blank
   - Choose True or False for T/F questions
5. **Navigate**: Click "Next Question" to proceed
6. **Submit**: Click "Submit Quiz" on the last question
7. **View Results**: See your score, percentage, and performance breakdown
8. **Review Answers**: Click "Review Answers" to see detailed explanations

## Technical Implementation

### HTML Structure
- Semantic HTML5 structure
- Screen-based navigation system
- Accessible form inputs
- Progress indicators

### CSS Features
- Modern gradient backgrounds
- Flexbox and Grid layouts
- CSS animations and transitions
- Mobile-responsive design
- Interactive hover effects

### JavaScript Functionality
- Object-oriented programming approach
- Dynamic question loading
- Real-time answer validation
- Score calculation algorithms
- Local state management

## Question Types Explained

### Multiple Choice
Select one correct answer from 4 options (A, B, C, D).

### Multiple Select
Select all correct answers from the given options. Partial credit not awarded.

### Fill in the Blank
Type the correct answer in the text field. Case-insensitive matching.

### True or False
Select either True or False for the given statement.

## Scoring System

- **Correct Answer**: 1 point
- **Incorrect Answer**: 0 points
- **Final Score**: Total correct answers / Total questions
- **Performance Ratings**:
  - 90-100%: Excellent
  - 70-89%: Good
  - 50-69%: Average
  - 0-49%: Needs Improvement

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Customization

### Adding New Questions
Edit the `questionSets` object in `script.js`:

```javascript
const questionSets = {
    general: [
        {
            type: 'multiple-choice',
            question: 'Your question here?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: 'a', // a, b, c, or d
            explanation: 'Explanation of the correct answer.'
        }
        // Add more questions...
    ]
};
```

### Question Type Properties
- **type**: 'multiple-choice', 'multiple-select', 'fill-blank', 'true-false'
- **question**: The question text
- **options**: Array of options (for multiple choice/select)
- **correct**: Correct answer(s)
- **explanation**: Explanation shown in review

## Performance Features

- Lightweight vanilla JavaScript (no dependencies)
- Optimized DOM manipulation
- Efficient event handling
- Smooth animations with CSS transforms
- Mobile-optimized touch interactions

## Future Enhancements

- Timer functionality
- Question difficulty levels
- User profiles and progress tracking
- Question categories and tags
- Export results functionality
- Audio/visual question support

## License

This project is open source and available under the MIT License.
