const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || "secret";
const PASSWORD = process.env.ADMIN_PASSWORD || "admin";

app.use(cors());
app.use(express.json());

const blogsPath = path.join(__dirname, "blogs.json");

function readBlogs() {
  if (!fs.existsSync(blogsPath)) return [];
  const data = fs.readFileSync(blogsPath);
  return JSON.parse(data);
}

function writeBlogs(blogs) {
  fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));
}

app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    const token = jwt.sign({ user: "admin" }, SECRET_KEY, { expiresIn: "2h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid password" });
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

app.get("/blogs", (req, res) => {
  const blogs = readBlogs();
  res.json(blogs);
});

app.post("/blogs", authenticate, (req, res) => {
  const blogs = readBlogs();
  blogs.unshift(req.body);
  writeBlogs(blogs);
  res.status(201).json({ message: "Blog added" });
});

app.put("/blogs/:title", authenticate, (req, res) => {
  const blogs = readBlogs();
  const index = blogs.findIndex((b) => b.title === req.params.title);
  if (index === -1) return res.sendStatus(404);
  blogs[index] = req.body;
  writeBlogs(blogs);
  res.json({ message: "Blog updated" });
});

app.delete("/blogs/:title", authenticate, (req, res) => {
  const blogs = readBlogs();
  const updated = blogs.filter((b) => b.title !== req.params.title);
  writeBlogs(updated);
  res.json({ message: "Blog deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
