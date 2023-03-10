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
    origin: ["https://toxic-coding.github.io", "https://apipre-e1dc8.web.app"],
    credentials: true,
  })
);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});
//sessions
app.use(cookieParser());
// Set up the Express app and session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true, // set to true if your app is hosted on HTTPS
      sameSite: "none", // set to 'none' if your app is hosted on a different domain
      maxAge: 86400000, // session expiration time in milliseconds
    },
  })
);
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "interest-cohort=()");
  next();
});
const port = process.env.PORT || 5000;

/* A middleware that parses the body of the request. */
app.use(express.json());

app.use("/api/auth", require("./Routes/auth"));

/* Listening to the port 4000. */
app.listen(port, () => {
  console.log(port);
});

/* Connecting to the database. */
connectDb();
