require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser');
const cardRoutes = require('./routes/cards');
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to the database!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Routes
app.use('/api/cards', cardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
