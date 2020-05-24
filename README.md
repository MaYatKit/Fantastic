<a href="https://fantastic.com/">
    <img title="Fantastic Logo" height="150" src="https://github.com/BennyChun/Group-9-Amethyst-Ant/blob/master/client/src/image/logo.png">
</a>

# Fantastic 


Fantastic is a party webapp that lets guests collaborate on a music playlist that should be played in the party. More details about the application can be found in the [wiki](https://github.com/BennyChun/Group-9-Amethyst-Ant/wiki)

## Building

### Dependencies

1. [Nodejs](https://nodejs.org): Fantastic uses Node.js to build the backend, Node.js is a JavaScript runtime built on [Chrome's V8 JavaScript engine](https://v8.dev/).
1. [Expressjs](https://expressjs.com/): Fantastic uses expressjs to build the API endpoints in the server
1. [Socket.io](https://socket.io/): Fantastic uses socket.io to sync updates between multiple users and the client and server
1. [MongoDB](https://www.mongodb.com/): Fantastic is built upon MongoDB Atlas Cloud Service. Set up a Clusters for your project. For user management, you can use [website](https://cloud.mongodb.com) or [Compass](https://www.mongodb.com/products/compass) to connect to your database.
1. [Spotify](https://beta.developer.spotify.com/), [Passport-Spotify](https://github.com/JMPerez/passport-spotify): Fantastic plays music from Spotify. Set up a Spotify Developer Application (you need a Spotify Premium account) and configure the OAuth redirect URL. Usually at least `http://localhost:3000` is needed for a dev-environment; Passport-Spotify is a library to authenticate with spotify following the OAuth2.0 strategy.
1. [React](https://reactjs.org/): Fantastic constructs frontend using React, a JavaScript library for building user interfaces , which is Declarative, Component-Based and Scalable.

### Environment Files

Fantastic loads sensitive configuration variables though .env files.

- `server/.env`: This file includes some configuration for Spotify and MongoDB such as spotify client ID, spotify client secret and spotify callback url and MongoDB database URI:
    ```js
    SPOTIFY_CLIENT_ID='...'
    SPOTIFY_CLIENT_SECRET='...'
    SPOTIFY_CALLBACK_URL='...'
    MONGODB_URI='...'
    ```


### Building & Testing

The `client/package.json` contains all necessary dependencies for building the Fantastic frontend.
- `npm run test`: Runs all unit tests in the files with suffix `.test.js`.
- `npm start`: Starts the server locally at `localhost:3000`

The `server/package.json` contains all necessary dependencies for building the Fantastic backend.
- `npm run test`: Runs all unit tests in the `test` folder for the backend 
- `npm start`: Starts the server locally at `localhost:1000`


## Contributing

1. Fork it! :octocat:
1. Create your feature branch: `git checkout -b my-improvement`
1. Make your changes and test them!
1. Commit & push your changes
1. Submit a pull request :rocket:

## License

License is held by [The University of Auckland](https://www.auckland.ac.nz/en.html).

