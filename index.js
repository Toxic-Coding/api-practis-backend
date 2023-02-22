/* Importing the db.js file. */
const connectDb = require("./db");
/* Importing the express module. */
const express = require("express");
/* Allowing the client to access the server. */
const cors = require("cors");
const session = require("express-session");
// const cookieParser = require("cookie-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
/* Creating an instance of the express application. */
const app = express();

/* Allowing the client to access the server. */
app.use(cors({ origin: "https://toxic-coding.github.io" }));

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "mySessions",
});
//sessions
// Set up the Express app and session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      domain: "https://toxic-coding.github.io",
      sameSite: "none",
    },
  })
);
// app.use((req, res, next) => {
//   console.log(req.session);
//   next();
// });
/* Setting the port to 4000. */
const port = process.env.PORT || 5000;

/* A middleware that parses the body of the request. */
app.use(express.json());

app.use("/api/auth", require("./Routes/auth"));

/* Listening to the port 4000. */
app.listen(port, () => {
  // console.log(`live on http://localhost:${port}`);
});

/* Connecting to the database. */
connectDb();
