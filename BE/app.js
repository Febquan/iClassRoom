require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const https = require("https");
const cors = require("cors");
const passport = require("passport");
const authMiddleware = require("./middleware/authMiddleware");
const userAuthRoute = require("./route/userRoutes");
const port = process.env.PORT;

require("./utils/faceBookAuth.js");
require("./utils/googleAuth.js");
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "None" },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
//Allowance
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userAuthRoute);
app.get("/", (req, res) => {
  console.log(req.session.user, req.user);
  res.send("hello111");
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ error: message, success: false });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(port, () => {
//   console.log(`Server is running on https://localhost:${port}`);
// });
