import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

function slugify(text) {
  return encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"));
}

export default function BlogList({ blogs }) {
  const latestBlogs = blogs.slice(0, 3);

  return (
    <>
      <section className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">TecHoneStory</h1>
          <p className="lead">Tech. Honest. Story.</p>
        </div>
      </section>

      <section className="container py-5 px-2 px-md-4">
        <div className="text-center mb-4">
          <hr className="mb-2" />
          <h3 className="fw-bold">Latest Blogs</h3>
          <hr className="mt-2" />
        </div>

        <div className="row g-4">
          {latestBlogs.length === 0 ? (
            <p className="text-center">No blogs yet. Check back soon.</p>
          ) : (
            latestBlogs.map((blog, idx) => (
              <div key={idx} className="col-md-4">
                <Link
                  to={`/blogs/${slugify(blog.title)}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card blog-card h-100">
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt="Blog Visual"
                        className="card-img-top"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="fw-semibold mb-1">{blog.title}</h5>
                      <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                        {blog.date}
                      </p>
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="btn btn-outline-primary btn-sm">Read More</span>
                        {blog.amazonLink && (
                          <a
                            href={blog.amazonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-warning btn-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Buy on Amazon
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="bg-light text-center py-4 mt-5 border-top">
        <div className="container">
          <p>
            Contact: <a href="mailto:userr776@proton.me">userr776@proton.me</a>
          </p>
          <div className="mt-2">
            <a href="https://github.com/RaulAbakarov" className="me-3 text-decoration-none">GitHub</a>
            <a href="https://instagram.com/_wfwycl" className="me-3 text-decoration-none">Instagram</a>
            <a href="https://twitter.com/" className="text-decoration-none">Twitter</a>
          </div>
        </div>
      </footer>
    </>
  );
}
