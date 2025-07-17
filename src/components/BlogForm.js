// src/components/BlogForm.js
import React, { useState, useEffect } from "react";

export default function BlogForm({ onSubmit, initialData, loading }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [amazonLink, setAmazonLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setImageUrl(initialData.imageUrl || "");
      setAmazonLink(initialData.amazonLink || "");
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
      setAmazonLink("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }
    onSubmit({
      title,
      content,
      imageUrl,
      amazonLink,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm p-4 mb-4">
      <h5 className="fw-bold mb-3">{initialData ? "Edit Blog" : "New Blog"}</h5>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea
          className="form-control"
          value={content}
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input
          className="form-control"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Amazon Link (optional)</label>
        <input
          className="form-control"
          type="text"
          value={amazonLink}
          onChange={(e) => setAmazonLink(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Blog" : "Add Blog"}
      </button>
    </form>
  );
}
