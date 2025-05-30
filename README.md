# Tic Tac Tix

A modern, responsive Tic Tac Toe game with multiple game modes including online multiplayer, bot play, and local multiplayer.

## Features

- 🎮 **Three Game Modes:**
  - Play with a friend online (real-time multiplayer)
  - Play with a Bot (AI with minimax algorithm)
  - Play with a friend offline (local multiplayer)

- 🎯 **Unique Gameplay:** Three-in-a-row with disappearing moves after 3 turns
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile
- 🎨 **Modern UI:** Beautiful gradient backgrounds and smooth animations
- ⚡ **Real-time:** Instant multiplayer using Socket.IO

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

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

For the **full online multiplayer experience**, you need to run both the client and server:

1. **Start the Socket.IO server** (in one terminal):
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3001`

2. **Start the client** (in another terminal):
   ```bash
   npm run dev
   ```
   The client will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

### Game Modes

#### 🌐 Play with a Friend (Online)
- Create a room and share the generated link with your friend
- Real-time multiplayer using WebSockets
- Cross-platform: works on any device with a browser

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
├── server/                 # Socket.IO server
│   ├── server.js          # Main server file
│   └── package.json       # Server dependencies
└── package.json           # Client dependencies
```

### Key Technologies

- **Frontend:** React, Vite, CSS3
- **Backend:** Node.js, Express, Socket.IO
- **Real-time Communication:** WebSockets
- **Styling:** CSS Grid, Flexbox, CSS Animations

## Deployment

### Free Deployment Options

**Client (Frontend):**
- Vercel
- Netlify
- GitHub Pages

**Server (Backend):**
- Railway
- Render
- Heroku (free tier)
- Cyclic

### Environment Variables

When deploying, update the Socket.IO server URL in `src/utils/socketService.js`:

```javascript
connect(serverUrl = 'https://your-server-url.com')
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Vite for the fast development experience
