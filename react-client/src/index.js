import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faComment as farComment, faUser as farUser, faArrowAltCircleRight, faArrowAltCircleLeft, faEdit } from '@fortawesome/free-regular-svg-icons';

library.add(farThumbsUp, fasThumbsUp, farComment, farUser, faArrowAltCircleRight, faArrowAltCircleLeft, faEdit);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
