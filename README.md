# Facebook-clone

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
  * [Features](#features)
  * [Roadmap](#roadmap)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Run](#run)
* [License](#license)



<!-- ABOUT THE PROJECT -->
## About The Project

![screenshot.png]

A friend of mine gave me a challenge, "let's see who will make the best facebook clone in one weeks." Of course I accepted the challenge. So this is my MVP Facebook-Clone made in approximately one week.

The Project was fun to do and made me combine my previous knowledge about image uploading, APIs, websocket and react into a working project. Am I proud of my end product? Yes, I am. ...Well not so proud about all the design, but I'm overall happy about how it turned out.

## What I learned
- React's new useState and useHooks makes it faster and much more pleasant to make components.
- CSS is still hard, Bootstrap saves my day everytime, but I have to practice UI-design
- Small components makes it easy to reuse, but too small components makes it hard to integrate logic.
- Streaming data from user to database through sharp image processor is still hard, but I'm getting the hang of it.
- NodeJS is still treating me good, but I should make my next project in .net Core to expand my horizon.

### Built With
* [React](https://reactjs.org/) - Starting to love React now <3
* [React-Router](https://reacttraining.com/react-router/)
* [React-Bootstrap](https://react-bootstrap.github.io/) - Got to make it kinda pretty
* [Node](https://nodejs.org/en/) - So fast to build backends, and used it for a long time
* [Express](https://expressjs.com/) - REST API
* [Socket.io](https://socket.io/) - Live chat messages
* [MariaDB](https://mariadb.org/) - For all relational text data
* [MongoDB](https://mongodb.org/) - To emulate a s3 bucket or similar, used for images. I chosed to save in database instead of on filesystem because I think that is more realistic in for future products, where you need backups and or saves the file in Azure Bucket or s3 storage or whatever those services are called.

## Features
- Real time chat with socket.io. With annoying popup chat when friends message you.
![chat.gif]

- Posts with multiple images
![posts.gif]

- Liking, adding friends, multiple chat windows etc.
- Custom profile picture
- Images are processed with sharpjs to make large, medium and small copies in mongodb gridFsBucket
- Dedicated space to ads, have to make the investors happy.
- Passwords are encrypted with bcrypt of course.

## roadmap
Things that I will add if I decide to spend more time on this:
- [ ] Group messages
- [ ] Friend requests, now the friend requests are automatically added
- [x] Automatically open chat window when a friend sends message to you
- [ ] Notify user on new posts, likes, comments
- [ ] Comments on posts, needs front-end


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [MariaDB](https://downloads.mariadb.org/) or similar sql database
* [MongoDB](https://www.mongodb.com/download-center/community) for storing images

### Installation

1. Clone the repo
```sh
git clone https://github.com/mathiash98/facebook-clone.git
```
3. Install NPM packages
```sh
cd ./node-backend
npm install
cd ..
cd ./react-client
npm install
```
4. Edit `config.js` to suit you example:
```JS
module.exports = {
    db: {
        mariadb: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'facebook-clone'
        },
        mongodb: {
            uri: 'mongodb://localhost:27017',
            dbName: 'facebook-clone'
        }
    },
    jwt: {
        // used for encrypting and decoding the jwt-tokens,
        // make it a long an difficult string
        secret: 'Sup3rDup3rS3cr3tP@ssw0rdF0rJWTTôk£nAuthênticãtiõns'
    },
    port: {
        development: 8888
    }
};
```
5. Run `./facebook-clone.sql` in your sql database to setup tables.
6. Procceed to [Run](#run)

### Run
This is for development
1. Start mongodb and mariadb
2. start node-backend and react-client
```sh
cd ./node-backend
nodemon index
```
```sh
cd ./react-client
npm start
```
3. Make some users, search for the users you made, add them as friend and start chatting and posting.

### Extras
#### Diagram for MariaDB
![er-diagram.png]

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.


<!-- MARKDOWN LINKS & IMAGES -->
[screenshot.png]: ./screenshot.png
[chat.gif]: ./chat.gif
[posts.gif]: ./posts.gif
[er-diagram.png]: ./er-diagram.png
