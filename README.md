# Enhanced English Learning App for Assamese Speakers

A comprehensive 30-day English learning application designed specifically for native Assamese speakers, featuring AI-powered learning assistance and bilingual support.

## 🚀 New Features

### 1. Enhanced Word Structure

- **Descriptions**: Each word now includes detailed English and Assamese descriptions
- **Word Limit**: Lessons are limited to maximum 15 words for optimal learning
- **Comprehensive Examples**: Rich context with usage examples in both languages

### 2. AI-Powered Learning Assistant

- **Claude API Integration**: Advanced AI assistance for personalized learning
- **Three Learning Modes**:
  - **Explanation**: Detailed word explanations with cultural context
  - **Practice**: Interactive exercises and translation practice
  - **Culture**: Cultural context and usage guidelines

### 3. Enhanced User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Audio Pronunciation**: Text-to-speech for English words
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Bilingual Interface**: Full support for English and Assamese

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Claude API key from Anthropic

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_CLAUDE_API_KEY=your_claude_api_key_here
   VITE_DEBUG_MODE=false
   ```

4. **Get your Claude API key**

   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create an account and generate an API key
   - Add the key to your `.env` file

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 Learning Structure

### 30-Day Curriculum

The app includes a comprehensive 30-day curriculum covering:

- **Days 1-10**: Basic vocabulary and greetings
- **Days 11-20**: Grammar fundamentals and verb tenses
- **Days 21-30**: Advanced concepts and cultural context

### Lesson Categories

- **Vocabulary**: Essential words and phrases
- **Grammar**: Verb tenses, sentence structure
- **Phrases**: Common expressions and idioms
- **Pronunciation**: Phonetic guidance

### Difficulty Levels

- **Beginner**: Basic words and simple sentences
- **Intermediate**: Complex grammar and vocabulary
- **Advanced**: Advanced concepts and cultural nuances

## 🤖 AI Learning Assistant Features

### Word Explanation Mode

- Detailed English explanations
- Assamese translations
- Additional examples
- Common mistakes made by Assamese speakers
- Memory tips and tricks

### Practice Mode

- Fill-in-the-blank exercises
- Translation practice (English ↔ Assamese)
- Conversation scenarios
- Grammar tips and rules

### Cultural Context Mode

- Cultural relevance explanations
- Assamese cultural equivalents
- Usage guidelines
- Cultural considerations

## 🎯 Key Features

### For Assamese Speakers

- **Native Language Support**: Full Assamese translations and explanations
- **Cultural Context**: Understanding of Assamese culture and traditions
- **Pronunciation Guide**: Phonetic pronunciation for English words
- **Progressive Learning**: Structured 30-day curriculum

### Technical Features

- **Modern React**: Built with React 18 and TypeScript
- **Tailwind CSS**: Beautiful, responsive design
- **Vite**: Fast development and building
- **Claude AI**: Advanced AI-powered learning assistance

## 📱 Usage Guide

### Starting a Lesson

1. Select a lesson from the main dashboard
2. Click "Start Lesson" to begin
3. Review each word with pronunciation and examples
4. Use the AI Assistant for additional help
5. Mark words as learned when comfortable
6. Complete the lesson to track progress

### Using the AI Assistant

1. Click "AI Assistant" button after showing translation
2. Choose from three modes:
   - **Explanation**: Get detailed word explanations
   - **Practice**: Access interactive exercises
   - **Culture**: Learn cultural context
3. Follow the AI-generated content for enhanced learning

### Progress Tracking

- Visual progress indicators for each lesson
- Completion tracking for individual words
- Overall progress statistics
- Streak tracking for daily learning

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── AILearningAssistant.tsx
│   ├── LessonCard.tsx
│   ├── LessonGrid.tsx
│   ├── LessonView.tsx
│   └── Header.tsx
├── data/               # Lesson data
│   └── lessons.ts
├── hooks/              # Custom React hooks
│   └── useProgress.ts
├── services/           # API services
│   └── claudeService.ts
└── types/              # TypeScript definitions
    └── index.ts
```

### Key Components

#### AILearningAssistant

- Provides AI-powered learning assistance
- Three learning modes: explanation, practice, culture
- Integrates with Claude API for personalized content

#### LessonView

- Main learning interface
- Displays words with descriptions and examples
- Integrates AI assistant functionality
- Progress tracking and navigation

#### ClaudeService

- Handles API communication with Claude
- Generates personalized learning content
- Error handling and response parsing

## 🌟 Benefits for Assamese Learners

### Cultural Relevance

- Understanding of Assamese cultural context
- Comparison with Assamese language concepts
- Cultural nuances in English usage

### Language Bridge

- Direct translations from Assamese to English
- Pronunciation guidance for English sounds
- Grammar explanations in Assamese context

### Personalized Learning

- AI-generated content based on learning level
- Common mistakes specific to Assamese speakers
- Memory techniques tailored to Assamese learners

## 🚀 Future Enhancements

### Planned Features

- **Voice Recognition**: Practice pronunciation with AI feedback
- **Offline Mode**: Download lessons for offline learning
- **Gamification**: Points, badges, and achievements
- **Social Learning**: Connect with other learners
- **Advanced Analytics**: Detailed learning progress reports

### Technical Improvements

- **PWA Support**: Progressive Web App capabilities
- **Performance Optimization**: Faster loading and smoother interactions
- **Accessibility**: Enhanced support for screen readers and keyboard navigation
- **Multi-language Support**: Support for additional Indian languages

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Anthropic**: For providing the Claude API
- **Assamese Language Community**: For cultural insights and feedback
- **Open Source Community**: For the amazing tools and libraries used

## 📞 Support

For support, questions, or feedback:

- Create an issue in the repository
- Contact the development team
- Join our community discussions

---

**Happy Learning! শুভ শিক্ষা!** 🎓
