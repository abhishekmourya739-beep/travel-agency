import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { adminLogin } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(formData);

      console.log("LOGIN RESPONSE:", res);

      const token = res?.data?.accessToken || "";
      const admin = res?.data?.admin || null;
      const refreshToken = res?.data?.refreshToken || "";

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("adminToken", token);

      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }

      if (admin) {
        localStorage.setItem("adminUser", JSON.stringify(admin));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card border-0 shadow-lg p-4 rounded-4">
        <h2 className="fw-bold mb-2">Admin Login</h2>
        <p className="text-muted mb-4">Sign in to access dashboard</p>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
