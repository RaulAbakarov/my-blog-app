import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

// slugify for URL-friendly titles
function slugify(text) {
  return encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"));
}

export default function AllBlogs({ blogs }) {
  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5 px-2 px-md-4">
      <h2 className="text-center mb-4">All Blog Posts</h2>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search blog posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredBlogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        filteredBlogs.map((blog, idx) => (
          <div key={idx} className="card mb-4 shadow-sm w-100">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt="Product"
                className="card-img-top"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            )}

            <div className="card-body">
              <h4 className="card-title text-primary fw-bold">{blog.title}</h4>
              <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                {blog.date}
              </p>

              <div className="card-text mb-3" style={{ fontSize: "0.95rem" }}>
                <ReactMarkdown>
                  {blog.content.length > 200
                    ? blog.content.slice(0, 200) + "..."
                    : blog.content}
                </ReactMarkdown>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/blogs/${slugify(blog.title)}`}
                >
                  Read More
                </Link>

                {blog.amazonLink && (
                  <a
                    href={blog.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning btn-sm"
                  >
                    Buy on Amazon
                  </a>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
