const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const BLOG_FILE = path.join(__dirname, "blogs.json");

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET || !ADMIN_PASSWORD) {
  console.error("Error: JWT_SECRET and ADMIN_PASSWORD must be set in environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Helper to safely read blog file
function readBlogs() {
  try {
    const data = fs.readFileSync(BLOG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write blog file
function writeBlogs(blogs) {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(blogs, null, 2));
}

// Admin login route
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// GET all blogs (public)
app.get("/blogs", (req, res) => {
  const blogs = readBlogs();
  res.json(blogs);
});

// POST new blog (protected)
app.post("/blogs", authenticateToken, (req, res) => {
  const { title, content, imageUrl, amazonLink } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newBlog = {
    title,
    content,
    imageUrl: imageUrl || "",
    amazonLink: amazonLink || "",
    date: new Date().toLocaleString(),
  };

  const blogs = readBlogs();
  blogs.unshift(newBlog);
  writeBlogs(blogs);

  res.status(201).json({ success: true, blog: newBlog });
});

// PUT /blogs/:title (protected)
app.put("/blogs/:title", authenticateToken, (req, res) => {
  const originalTitle = decodeURIComponent(req.params.title);
  const { title, content, imageUrl, amazonLink } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  let blogs = readBlogs();

  let updated = false;

  blogs = blogs.map((b) => {
    if (b.title === originalTitle) {
      updated = true;
      return {
        ...b,
        title,
        content,
        imageUrl: imageUrl || "",
        amazonLink: amazonLink || "",
        date: new Date().toLocaleString(),
      };
    }
    return b;
  });

  if (!updated) {
    return res.status(404).json({ error: "Blog not found" });
  }

  writeBlogs(blogs);
  res.json({ success: true });
});

// DELETE /blogs/:title (protected)
app.delete("/blogs/:title", authenticateToken, (req, res) => {
  const title = decodeURIComponent(req.params.title);
  const blogs = readBlogs();

  const filteredBlogs = blogs.filter((b) => b.title !== title);

  if (filteredBlogs.length === blogs.length) {
    return res.status(404).json({ error: "Blog not found" });
  }

  writeBlogs(filteredBlogs);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
