#!/bin/bash

# Setup script for Enhanced English Learning App
echo "🚀 Setting up Enhanced English Learning App for Assamese Speakers"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Environment Variables for English Learning App
# Get your API key from: https://console.anthropic.com/
VITE_CLAUDE_API_KEY=your_claude_api_key_here

# Optional: Enable debug mode for development
VITE_DEBUG_MODE=false
EOF
    echo "✅ .env file created"
    echo "⚠️  Please edit .env file and add your Claude API key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Get your Claude API key from: https://console.anthropic.com/"
echo "2. Edit the .env file and replace 'your_claude_api_key_here' with your actual API key"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 Features:"
echo "• 30-day comprehensive English curriculum"
echo "• AI-powered learning assistant with Claude"
echo "• Bilingual support (English & Assamese)"
echo "• Cultural context and pronunciation guides"
echo "• Interactive exercises and practice modes"
echo ""
echo "Happy Learning! শুভ শিক্ষা! 🎓"
