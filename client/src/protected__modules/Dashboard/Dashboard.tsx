import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/app_state/hooks";
import { authActions } from "../../lib/app_state/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(authActions.clearAuth());
    navigate("/login");
  };

  return (
    <div>
      <header>
        <div>Header</div>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <main>
        <div>Content</div>
        {user ? (
          <div>
            <div>{user.full_name}</div>
            <div>{user.email}</div>
            <div>{user.role}</div>
          </div>
        ) : null}
      </main>
      <footer>Footer</footer>
    </div>
  );
};

export default Dashboard;
