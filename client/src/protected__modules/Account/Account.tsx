import { type SubmitEvent, useState } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import { useChangePasswordMutation } from "../../lib/app_state/userApi";

const Account = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [changePassword, { isLoading, isError, isSuccess, error }] =
    useChangePasswordMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      }).unwrap();
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch {
      // Mutation state handles errors.
    }
  };

  return (
    <div>
      <h1>Account</h1>
      <div>
        <div>{user?.full_name}</div>
        <div>{user?.email}</div>
        <div>{user?.role}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPasswordConfirm">Confirm new password</label>
          <input
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Change password
        </button>
        {isSuccess ? <div>Password updated.</div> : null}
        {isError ? (
          <div>
            {typeof error === "object" && error && "status" in error
              ? `Password update failed (${error.status})`
              : "Password update failed"}
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default Account;
