import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./public_modules/Login/Login";
import Dashboard from "./protected__modules/Dashboard/Dashboard";
import { useAppSelector } from "./lib/app_state/hooks";
import { getAuthToken } from "./lib/app_state/authCookies";
import { useMeQuery } from "./lib/app_state/authApi";
import Layout from "./protected__modules/Layout/Layout";
import AddUser from "./protected__modules/AddUser/AddUser";
import UsersList from "./protected__modules/UsersList/UsersList";
import Account from "./protected__modules/Account/Account";

const App = () => {
  const token = getAuthToken();
  const user = useAppSelector((state) => state.auth.user);
  const { isFetching } = useMeQuery(undefined, { skip: !token });
  const isAuthed = Boolean(token && user);

  if (token && isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthed ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="new-user" element={<AddUser />} />
          <Route path="users" element={<UsersList />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
