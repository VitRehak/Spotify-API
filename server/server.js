const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const cors = require("cors");
const lyricsFinder = require("lyrics-finder");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "3423bd7afb8b40e985990c92b57d1793",
    clientSecret: "8d11c25100d7413eb4e7852ac6f58c4c",
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "3423bd7afb8b40e985990c92b57d1793",
    clientSecret: "8d11c25100d7413eb4e7852ac6f58c4c",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

app.get("/lyrics", async (req, res) => {
    const lyrics = (await lyricsFinder(req.query.artist, req.query.track))||"No Lyrics Found"
    res.json(lyrics);
});

app.listen(3001);
