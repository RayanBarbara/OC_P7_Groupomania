const express = require('express');
const path = require('path');

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/user.routes");
const postsRoutes = require("./routes/post.routes");
const commentsRoutes = require("./routes/comment.routes");
const votesRoutes = require("./routes/vote.routes");

// Create an Express app
const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Allows cross-origin requests to access the API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

// Indicates to express to serve up the static resource images whenever it receives a request to the images folder endpoint
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api', authRoutes);

module.exports = app;