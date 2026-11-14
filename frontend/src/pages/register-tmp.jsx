import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import AuthLayout, { Field, PasswordField } from "../components/AuthLayout.jsx";
import "./Auth.css";
import api from "../api";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in: no reason to see this page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const passwordLongEnough = password.length >= 6;
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);

        try {
          const { data } = await api.post("/auth/register", {
            name,
            email,
            password,
          });

          dispatch(
            loginSuccess({
              user: { _id: data._id, name: data.name, email: data.email },
              token: data.token,
            }),
          );

          navigate("/", { replace: true });
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Unable to reach the server. Please try again.",
          );
        } finally {
          setLoading(false);
        }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      panelTitle="Join the pack"
      panelText="Create an account to start shopping for your pets."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <Field
          id="name"
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          required
        />

        <Field
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          minLength={6}
          autoComplete="new-password"
          hint={
            passwordLongEnough
              ? "✓ Looks good"
              : "Use at least 6 characters"
          }
          hintOk={passwordLongEnough}
          required
        />

        <PasswordField
          id="confirm"
          label="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          hint={passwordsMatch ? "✓ Passwords match" : undefined}
          hintOk={passwordsMatch}
          required
        />

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      <Link to="/" className="auth-back">
        Continue browsing
      </Link>
    </AuthLayout>
  );
}

export default Register;