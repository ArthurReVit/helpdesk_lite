import { type SubmitEvent, useState } from "react";
import { useRegisterUserMutation } from "../../lib/app_state/userApi";
import { useAppDispatch, useAppSelector } from "../../lib/app_state/hooks";
import { userActions } from "../../lib/app_state/userSlice";
import type { UserRole } from "../../models/user";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("requester");
  const dispatch = useAppDispatch();
  const { lastRegisterMessage, lastRegisterError } = useAppSelector(
    (state) => state.users,
  );
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(userActions.clearRegisterStatus());
    try {
      await registerUser({
        email,
        password,
        full_name: fullName,
        role,
      }).unwrap();
      setEmail("");
      setFullName("");
      setPassword("");
      setRole("requester");
    } catch {
      // Errors handled by slice + mutation state.
    }
  };

  if (!user || user.role !== "admin") {
    return <div>You're not supposed to be here. Sending alert...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>
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
      <div>
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          <option value="requester">Requester</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={isLoading}>
        Create user
      </button>
      {lastRegisterMessage ? <div>{lastRegisterMessage}</div> : null}
      {lastRegisterError ? <div>{lastRegisterError}</div> : null}
    </form>
  );
};

export default AddUser;
