require("dotenv").config();  
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes"); 

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

const allowedOrigins = [
  "http://localhost:3000",
  "https://blogapp-one-phi.vercel.app",
  "https://blogapp-unqo.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API Server is running!",
    endpoints: {
      health: "/api/health",
      blogs: "/api/blogs",
    },
  });
});

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

module.exports = app;
