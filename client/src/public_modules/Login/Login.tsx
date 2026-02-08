import { type SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../lib/app_state/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email, password }).unwrap();
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        Log in
      </button>
      {isError ? (
        <div>
          {typeof error === "object" && error && "status" in error
            ? `Login failed (${error.status})`
            : "Login failed"}
        </div>
      ) : null}
    </form>
  );
};

export default Login;
