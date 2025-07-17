import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import BlogDetails from "./components/BlogDetails";
import BlogList from "./components/BlogList";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import AllBlogs from "./components/AllBlogs";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

function Navbar({ isLoggedIn }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [showCenterBrand, setShowCenterBrand] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 300;
      if (!isMobile && isHome) {
        setShowCenterBrand(window.scrollY > heroHeight);
      } else {
        setShowCenterBrand(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, isHome]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 fixed-top shadow-sm">
        <div className="container-fluid">
          {isMobile && !isHome && (
            <div className="mx-auto">
              <Link to="/" className="navbar-brand fw-bold text-center">
                TecHoneStory
              </Link>
            </div>
          )}
          <div className="d-none d-lg-flex justify-content-between w-100 align-items-center">
            <ul className="navbar-nav d-flex align-items-center">
              {isHome ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link fw-bold text-primary me-3" style={{ pointerEvents: 'none' }}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/blogs" className="nav-link">All Posts</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/" className="navbar-brand fw-bold fs-4 me-3">TecHoneStory</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link me-3">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/blogs" className="nav-link">All Posts</Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <li className="nav-item ms-3">
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                </li>
              )}
            </ul>
            <div className="d-flex align-items-center">
              <a href="mailto:userr776@proton.me" className="nav-link me-4">Contact Us</a>
              <a href="https://github.com/RaulAbakarov" target="_blank" rel="noopener noreferrer" className="nav-link me-3">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://instagram.com/_wfwycl" target="_blank" rel="noopener noreferrer" className="nav-link me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/raulabakarov/" target="_blank" rel="noopener noreferrer" className="nav-link">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          {!isMobile && showCenterBrand && (
            <Link
              to="/"
              className="position-absolute top-50 start-50 translate-middle fw-bold fs-4 text-dark text-decoration-none d-none d-lg-block"
            >
              TecHoneStory
            </Link>
          )}
        </div>
      </nav>
      <div style={{ height: "56px" }}></div>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error("Error fetching blogs:", err));
  }, []);

  const addBlog = (blogObj) => {
    fetch(`${API_BASE}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogObj)
    })
      .then(res => res.json())
      .then(data => setBlogs(prev => [data.blog, ...prev]))
      .catch(err => console.error("Error adding blog:", err));
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <AdminPanel blogs={blogs} setBlogs={setBlogs} addBlog={addBlog} />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route path="/blogs" element={<AllBlogs blogs={blogs} />} />
        <Route path="/blogs/:title" element={<BlogDetails blogs={blogs} />} />
      </Routes>
    </Router>
  );
}

export default App;
