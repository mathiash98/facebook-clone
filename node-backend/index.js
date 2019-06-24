// Index file
// Express related dependencies
const express = require('express');
const bodyParser = require('body-parser')
const busboy = require('connect-busboy');

const cors = require('cors');
const morgan = require('morgan');
// Routers for express
const router = require('./router/router');

// General dependencies
const config = require('./config');
const port = process.env.PORT || config.port.development;

// Start express app
const app = express();

// Configure express
app.use(morgan('dev')); // Log requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // For at react client skal få tilgang via nettleser fra en annen port.

// Import router module
app.use('/', router);

// Start listening for requests
app.listen(port, () => console.log(`Listening on port: ${port}`));