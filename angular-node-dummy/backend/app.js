const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const postRoutes = require("../backend/model/routes/posts");
const userRoutes = require("./model/routes/user");
const path = require("path");

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://pankaj:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.uvhoi.mongodb.net/node-angular"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/images", express.static(path.join("backend/images")));

module.exports = app;
