import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Register from "../auth/Register";
import AuthShowcase from "../components/AuthShowcase";
import { useAuth } from "../context/AuthContext";
import { extractError } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await register(payload);
      navigate("/dashboard");
    } catch (requestError) {
      setError(extractError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShowcase
      mode="register"
      onModeChange={(mode) => navigate(`/${mode}`)}
      role={role}
      onRoleChange={setRole}
    >
      <Register onSubmit={handleRegister} loading={loading} error={error} role={role} />
    </AuthShowcase>
  );
};

export default RegisterPage;
