// Index file
// Express related dependencies
const express = require('express');
// Start express app
const app = express();
const bodyParser = require('body-parser')
const busboy = require('connect-busboy');

const cors = require('cors'); // To enable react to use this server as API on another port than client
const morgan = require('morgan');
// General dependencies
const config = require('./config');
const port = process.env.PORT || config.port.development;

// TODO: change chat function to socket.io
// Socket.io used for chat system
const server = require('http').Server(app);
const io = require('./socket.io/io')(server);


// Routers for express
const router = require('./router/router');

// Configure express
app.use(morgan('dev')); // Log requests
app.use(cors({
    origin: '*',
    credentials: true
})); // For at react client skal få tilgang via nettleser fra en annen port.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());


// Import router module
app.use('/', router);

// Start listening for requests
server.listen(port, () => console.log(`Listening on port: ${port}`));