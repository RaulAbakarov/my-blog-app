import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">All Blogs</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {blogs.map((blog) => (
          <div className="col" key={blog.title}>
            <div className="card h-100 shadow-sm">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  className="card-img-top"
                  alt={blog.title}
                  style={{ objectFit: "cover", maxHeight: "200px" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content.slice(0, 100)}...</p>
                <Link to={`/blogs/${encodeURIComponent(blog.title)}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
