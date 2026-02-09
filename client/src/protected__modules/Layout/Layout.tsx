import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/app_state/hooks";
import { authActions } from "../../lib/app_state/authSlice";

const Layout = () => {
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
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {user?.role === "admin" && (
              <li>
                <Link to="/new-user">Add User</Link>
              </li>
            )}
            {user?.role === "admin" && (
              <li>
                <Link to="/users">Users List</Link>
              </li>
            )}
            {user?.role === "admin" && (
              <li>
                <Link to="/tickets">Tickets List</Link>
              </li>
            )}
            {user?.role === "agent" && (
              <li>
                <Link to="/agent-tickets">My Assigned Tickets</Link>
              </li>
            )}
            <li>
              <Link to="/my-tickets">My Tickets</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/create-ticket">Create Ticket</Link>
            </li>
          </ul>
        </nav>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
