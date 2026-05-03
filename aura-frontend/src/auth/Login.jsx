import { useEffect, useState } from "react";

const Login = ({ onSubmit, loading, error, role }) => {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });

  useEffect(() => {
    setForm((current) => ({ ...current, role }));
  }, [role]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Username or email"
        className="field-shell w-full"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="field-shell w-full"
        required
      />

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <button type="submit" className="primary-button w-full" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
