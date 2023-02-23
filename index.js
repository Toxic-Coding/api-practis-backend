/* Importing the db.js file. */
const connectDb = require("./db");
/* Importing the express module. */
const express = require("express");
/* Allowing the client to access the server. */
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
/* Creating an instance of the express application. */
const app = express();
app.set("trust proxy", 1);

// Allow requests from your React app
app.use(
  cors({
    origin: "https://toxic-coding.github.io",
    credentials: true,
  })
);

const store = new MongoDBStore({
  uri: "mongodb+srv://adil:wWybEYr14c5LtPCa@cluster0.wwxmokz.mongodb.net/mynotebook",
  collection: "mySessions",
});
//sessions
app.use(cookieParser());
// Set up the Express app and session middleware
app.use(
  session({
    secret: "your secret key here",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true, // set to true if your app is hosted on HTTPS
      sameSite: "none", // set to 'none' if your app is hosted on a different domain
      maxAge: 30000, // session expiration time in milliseconds
    },
  })
);
// Middleware to check if the session has expired
app.use((req, res, next) => {
  if (
    req.session.lastActivity &&
    Date.now() - req.session.lastActivity > 30000
  ) {
    // Regenerate the session ID
    req.session.regenerate((err) => {
      if (err) console.log(err);
    });
  }
  // Update the last activity timestamp
  req.session.lastActivity = Date.now();
  next();
});
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "interest-cohort=()");
  next();
});
const port = 5000;

/* A middleware that parses the body of the request. */
app.use(express.json());

app.use("/api/auth", require("./Routes/auth"));

/* Listening to the port 4000. */
app.listen(port, () => {
  console.log(port);
});

/* Connecting to the database. */
connectDb();
