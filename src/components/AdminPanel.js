import React, { useState, useEffect } from "react";
import BlogForm from "./BlogForm";

export default function AdminPanel() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:4000/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = async (newBlog) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        await fetchBlogs();
        setEditingBlog(null);
      } else {
        alert("Error adding blog");
      }
    } catch (error) {
      console.error("Add blog error:", error);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (title) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/blogs/${encodeURIComponent(title)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchBlogs();
      } else {
        alert("Error deleting blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
    setLoading(false);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateBlog = async (updatedBlog) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/blogs/${encodeURIComponent(editingBlog.title)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBlog),
      });
      if (res.ok) {
        await fetchBlogs();
        setEditingBlog(null);
      } else {
        alert("Error updating blog");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Admin Panel</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <BlogForm
        onSubmit={editingBlog ? handleUpdateBlog : handleAddBlog}
        initialData={editingBlog}
        loading={loading}
      />

      <hr className="my-4" />

      <h4 className="fw-semibold">Existing Blogs</h4>
      {blogs.length === 0 && <p className="text-muted">No blogs yet.</p>}
      <div className="row row-cols-1 row-cols-md-2 g-4 mt-2">
        {blogs.map((blog) => (
          <div key={blog.title} className="col">
            <div className="card h-100 shadow-sm">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content.slice(0, 120)}...</p>
                <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>{blog.date}</p>
                {blog.amazonLink && (
                  <a
                    href={blog.amazonLink}
                    className="btn btn-sm btn-outline-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buy on Amazon
                  </a>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-sm btn-warning" onClick={() => handleEditBlog(blog)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteBlog(blog.title)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
