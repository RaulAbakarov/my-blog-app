import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./BlogCard.css";

function slugify(text) {
  return encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"));
}

export default function BlogDetails({ blogs }) {
  const { title } = useParams();
  const blog = blogs.find((b) => slugify(b.title) === title);

  if (!blog) return <div className="container py-5">Blog not found.</div>;

  const recommendations = blogs
    .filter((b) => slugify(b.title) !== title)
    .slice(0, 2);

  return (
    <div className="container py-5 px-2 px-md-4">
      <h2 className="mb-3 fw-bold">{blog.title}</h2>
      <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
        {blog.date}
      </p>

      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt="Product"
          className="img-fluid mb-4 rounded"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      <div style={{ fontSize: "1rem" }} className="mb-4">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {blog.amazonLink && (
        <div className="mb-5">
          <a
            href={blog.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-warning btn-sm"
          >
            Buy on Amazon
          </a>
        </div>
      )}

      {recommendations.length > 0 && (
        <section className="mt-5">
          <hr />
          <h4 className="mb-3">Recommended Posts</h4>
          <div className="row g-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="col-md-6">
                <Link
                  to={`/blogs/${slugify(rec.title)}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card blog-card h-100">
                    {rec.imageUrl && (
                      <img
                        src={rec.imageUrl}
                        alt="Recommendation"
                        className="card-img-top"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="fw-semibold mb-1">{rec.title}</h5>
                      <p className="text-muted" style={{ fontSize: "0.8rem" }}>
                        {rec.date}
                      </p>
                      <span className="btn btn-outline-primary btn-sm mt-2">Read More</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
