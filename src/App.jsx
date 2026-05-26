import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import StartScreen from './components/StartScreen';
import OfflineGame from './pages/OfflineGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StartScreen />} />
            <Route path="play/:mode" element={<OfflineGame />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
