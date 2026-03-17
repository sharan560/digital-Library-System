import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
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
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#f59e0b22,_#020617)] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold text-amber-300">Create Account</h1>
        {error && <p className="rounded bg-red-500/10 p-2 text-sm text-red-300">{error}</p>}
        <input className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-slate-950">Sign up</button>
        <p className="text-sm text-slate-300">
          Already registered? <Link className="text-amber-300" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
