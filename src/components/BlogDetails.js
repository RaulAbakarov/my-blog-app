import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function BlogDetails() {
  const { title } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/blogs`)
      .then((res) => res.json())
      .then((blogs) => {
        const found = blogs.find((b) => b.title === decodeURIComponent(title));
        setBlog(found);
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [title]);

  if (!blog) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">{blog.title}</h2>
      {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="img-fluid mb-3" />}
      <p>{blog.content}</p>
      {blog.amazonLink && (
        <a href={blog.amazonLink} target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-3">
          Buy on Amazon
        </a>
      )}
    </div>
  );
}
