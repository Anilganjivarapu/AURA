import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "../auth/Login";
import AuthShowcase from "../components/AuthShowcase";
import { useAuth } from "../context/AuthContext";
import { extractError } from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await login(payload);
      navigate("/dashboard");
    } catch (requestError) {
      setError(extractError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShowcase mode="login" onModeChange={(mode) => navigate(`/${mode}`)} role={role} onRoleChange={setRole}>
      <Login onSubmit={handleLogin} loading={loading} error={error} role={role} />
    </AuthShowcase>
  );
};

export default LoginPage;
