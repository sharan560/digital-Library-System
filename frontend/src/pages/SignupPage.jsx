import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AuthShell from "../components/AuthShell";

const SignupPage = () => {
  const { signup } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    emailNotificationsOptIn: true,
    role: "member",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await signup(form);
      navigate(user.role === "admin" ? "/admin" : "/member");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthShell
      dark={dark}
      onToggleTheme={toggleTheme}
      eyebrow="Create Access"
      title="Start your library workspace"
      description="Set up a member or librarian account and move directly into catalog browsing, reservations, and operational dashboards."
      altText="Already registered?"
      altLinkText="Sign in"
      altLinkTo="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="ui-title text-sm font-medium">Full Name</label>
            <input
              className="ui-input w-full"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="ui-title text-sm font-medium">Email Address</label>
            <input
              className="ui-input w-full"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="ui-title text-sm font-medium">Password</label>
            <input
              className="ui-input w-full"
              placeholder="At least 6 characters"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="ui-title text-sm font-medium">Role</label>
            <select
              className="ui-input w-full"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={form.emailNotificationsOptIn}
            onChange={(e) => setForm({ ...form, emailNotificationsOptIn: e.target.checked })}
          />
          <span className="ui-muted">Send email reminders every 5 minutes when overdue fines are active.</span>
        </label>

        <button className="ui-btn-primary w-full justify-center py-3 text-center">Create Account</button>
      </form>
    </AuthShell>
  );
};

export default SignupPage;
