import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar';

// Components

// Views
import Index from './views/index/Index';
import Chat from './views/chat/Chat';

function App() {
  return (
    <Router>
    <div>
      <header>
        <Navbar></Navbar>
      </header>

      <Route path="/" exact component={Index} />
      <Route path="/chat/" component={Chat} />
    </div>
  </Router>
  );
}

export default App;
