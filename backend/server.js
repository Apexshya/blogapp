const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://blogapp-one-phi.vercel.app",
  "https://blogapp-unqo.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true
  })
);

app.use(express.json());

app.use("/api/blogs", blogRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Blog API Server is running!", 
    endpoints: {
      health: "/api/health",
      blogs: "/api/blogs"
    }
  });
});

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = app;