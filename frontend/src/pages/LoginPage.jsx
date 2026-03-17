import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AuthShell from "../components/AuthShell";

const LoginPage = () => {
  const { login } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/member");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthShell
      dark={dark}
      onToggleTheme={toggleTheme}
      eyebrow="Welcome Back"
      title="Sign in to continue"
      description="Access member activity, librarian dashboards, issued books, and live reservation flows from one secure workspace."
      altText="New to StackShelf?"
      altLinkText="Create an account"
      altLinkTo="/signup"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <div className="space-y-2">
          <label className="ui-title text-sm font-medium">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            className="ui-input w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="ui-title text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="ui-input w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="ui-btn-primary w-full justify-center py-3 text-center">Login</button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
