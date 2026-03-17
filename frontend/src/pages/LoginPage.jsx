import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
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
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#f59e0b22,_#020617)] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold text-amber-300">Welcome Back</h1>
        <p className="text-sm text-slate-400">Sign in to your Digital Library workspace</p>
        {error && <p className="rounded bg-red-500/10 p-2 text-sm text-red-300">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-slate-950">Login</button>
        <p className="text-sm text-slate-300">
          New here? <Link className="text-amber-300" to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
