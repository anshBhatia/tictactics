# Tic Tac Tix

A modern, responsive Tic Tac Toe game with bot play and local multiplayer. Online multiplayer is intentionally locked behind a "Coming soon" state.

## Features

- 🎮 **Game Modes:**
  - Play with a Bot (AI with minimax algorithm)
  - Play with a friend offline (local multiplayer)
  - Online multiplayer is visible as "Coming soon"

- 🎯 **Unique Gameplay:** Three-in-a-row with disappearing moves after 3 turns
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile
- 🎨 **Modern UI:** Beautiful gradient backgrounds and smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tictactoe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the client**:
   ```bash
   npm run dev
   ```
   The client will run on `http://localhost:5173`

2. **Open your browser** and navigate to `http://localhost:5173`

### Game Modes

#### 🌐 Play with a Friend (Online)
- Locked for now
- The home screen shows this as a disabled "Coming soon" card

#### 🤖 Play with a Bot
- Challenge an AI opponent
- Uses minimax algorithm with depth 3 for intelligent gameplay
- Perfect for practice or solo play

#### 👥 Play with a Friend (Offline)
- Local multiplayer on the same device
- Take turns on the same screen
- Great for face-to-face gaming

## Development

### Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   └── App.jsx             # Main app component
└── package.json           # Client dependencies
```

### Key Technologies

- **Frontend:** React, Vite, CSS3
- **Styling:** CSS Grid, Flexbox, CSS Animations

## Deployment

### Free Deployment Options

**Client (Frontend):**
- Vercel
- Netlify
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Vite for the fast development experience
