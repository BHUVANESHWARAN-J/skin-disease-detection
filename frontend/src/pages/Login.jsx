import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await authService.login(form.username, form.password);
      localStorage.setItem("token", res.data.access);
      setUser({ token: res.data.access });
      nav("/upload");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
