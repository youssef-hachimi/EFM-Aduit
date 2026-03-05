import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@college.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, go to dashboard
  React.useEffect(() => {
    if (user) nav(user.role === "ADMIN" ? "/admin" : "/teacher", { replace: true });
  }, [user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // redirect happens via effect
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="card p-6">
          <h1 className="text-xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage attendance.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <div className="label">Email</div>
              <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <div className="label">Password</div>
              <input
                className="input mt-1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <button className="btn w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="text-xs text-slate-400">
              Tip: change default credentials after seeding. For production, use HTTPS + secure storage.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}