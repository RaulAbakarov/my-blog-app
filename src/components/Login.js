import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const apiBase = process.env.REACT_APP_API_URL;

    try {
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("authToken", token);
        onLogin();
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="mt-3" style={{ maxWidth: "400px" }}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-dark w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
