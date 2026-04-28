import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      await authService.register(form.username, form.email, form.password);
      alert("Registered successfully!");
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: "400px", margin: "0 auto" }}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <br />

      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <br />

      <button onClick={submit} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
