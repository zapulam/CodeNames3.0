# CodeNames 3.0

A modern, interactive web implementation of the popular word association game CodeNames, built with React, Tailwind CSS, and Framer Motion.

Play for free [here](https://zapulam.github.io/CodeNames3.0).

![CodeNames Game](https://img.shields.io/badge/React-19.0.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.6-38B2AC) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.1-purple)

## 🎮 Game Overview

CodeNames is a team-based word association game where players work together to identify their team's words while avoiding the opponent's words and the deadly assassin. This digital version features a sleek, modern interface with smooth animations and intuitive controls.

## ✨ Features

- **🎯 Dual View Modes**: Toggle between Player View (sees only revealed cards) and Codemaster View (sees all card roles)
- **🎨 Modern UI**: Dark theme with smooth animations and responsive design
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎲 Dynamic Game Generation**: Random word selection from a curated word list
- **⚡ Real-time Updates**: Instant feedback and game state management
- **🎪 Smooth Animations**: Polished transitions using Framer Motion
- **🎯 Win Detection**: Automatic win condition checking with themed popups
- **🔄 Collapsible Sidebar**: Space-efficient navigation with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeNames3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Play

### Game Setup
- The game uses 25 words arranged in a 5x5 grid
- Words are randomly assigned roles: 9 Red Team, 8 Blue Team, 7 Neutral, 1 Assassin
- Red team goes first

### Team Roles
- **Red Team**: 9 words to find
- **Blue Team**: 8 words to find  
- **Neutral**: 7 words (safe to guess, but don't help either team)
- **Assassin**: 1 word (instant loss if revealed)

### Gameplay
1. **Codemaster View**: One player can toggle to see all card roles
2. **Player View**: Other players see only revealed cards
3. **Take Turns**: Click cards to reveal them
4. **Win Condition**: First team to find all their words wins
5. **Lose Condition**: Revealing the assassin causes instant loss

### Controls
- **New Game**: Start a fresh game (with confirmation if game is in progress)
- **Toggle View**: Switch between Player and Codemaster modes
- **Collapse Sidebar**: Minimize the sidebar for more game space
- **Help**: Access game rules and instructions

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Deployment
- `npm run build`: Build for production
- `npm run deploy`: Deploy to Github pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Enjoy playing CodeNames 3.0! 🎉**
