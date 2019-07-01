import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar';

// Components

// Views
import Index from './views/index/Index';
import Profile from './views/profile/Profile';

import { UserProvider } from './context/UserContext';
import FriendList from './components/chat/FriendList';

function App() {
  return (
    <Router>
      <UserProvider>
        <header>
          <Navbar></Navbar>
        </header>

        <Route path="/" exact component={Index} />
        <Route path="/profile/:userId" component={Profile} />
        <FriendList/>
      </UserProvider>
  </Router>
  );
}

export default App;
