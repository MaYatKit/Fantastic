<a href="https://fantastic.com/">
    <img title="Fantastic Logo" height="150" src="https://github.com/BennyChun/Group-9-Amethyst-Ant/blob/master/client/src/image/logo.png">
</a>

# Fantastic 


Fantastic is a party webapp that lets your guests choose which music should be played in the party. [Fantastic](https://fantastic.rocks/)

## Building

### Dependencies

1. [Nodejs](https://nodejs.org): Fantastic uses Node.js to build the backend, Node.js is a JavaScript runtime built on [Chrome's V8 JavaScript engine](https://v8.dev/).
1. [MongoDB](https://www.mongodb.com/): Fantastic is built upon MongoDB Atlas Cloud Service. Set up a Clusters for your project. For user management, you can use [website](https://cloud.mongodb.com) or [Compass](https://www.mongodb.com/products/compass) to connect to your database.
1. [Spotify](https://beta.developer.spotify.com/), [Passport-Spotify](https://github.com/JMPerez/passport-spotify): Fantastic plays music from Spotify. Set up a Spotify Developer Application (you need a Spotify Premium account) and configure the OAuth redirect URL. Usually at least `http://localhost:3000` is needed for a dev-environment; Passport-Spotify is a library to authenticate with spotify following the OAuth2.0 strategy.
1. [React](https://reactjs.org/): Fantastic constructs frontend using React, a JavaScript library for building user interfaces , which is Declarative, Component-Based and Scalable.

### Environment Files

Fantastic loads configuration variables though JS/env files included in the build process. All following paths are relative to the repository root.

- `server/.env`: This file includes some configuration for Spotify and MongoDB such as spotify client ID, spotify client secret and spotify callback url; and MongoDB database URI:
    ```js
    SPOTIFY_CLIENT_ID='...'
    SPOTIFY_CLIENT_SECRET='...'
    SPOTIFY_CALLBACK_URL='...'
    MONGODB_URI='...'
    ```



Since all config values are loaded through standard ES modules machinery, building the project will notify you if something is missing.

### Building & Serving

The `client/package.json` contains all necessary commands for building Fantastic frontend.
- `start`<a name="react-scripts start"></a>: Compiles the JSX to JS and bundles all JS to chunk.js. You can then deploy the files in `/build` to a webserver of choice to run Fantastic.
- `build`: Build and run Fantastic frontend automatically.
- `test`: Run all unit tests in the files with suffix `.test.js`.

The `server/package.json` contains all necessary commands for building Fantastic backend.
- `test`<a name="mocha"></a>: Run all unit tests in the `test` folder for backend 
- `start`: Build and run Fantastic backend automatically.


## Contributing

1. Fork it! :octocat:
1. Create your feature branch: `git checkout -b my-improvement`
1. Make your changes and test them!
1. Commit & push your changes
1. Submit a pull request :rocket:

## License

License is hold by [The University of Auckland](https://www.auckland.ac.nz/en.html).

