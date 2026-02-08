import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./public_modules/Login/Login";
import Dashboard from "./protected__modules/Dashboard/Dashboard";
import { useAppSelector } from "./lib/app_state/hooks";
import { getAuthToken } from "./lib/app_state/authCookies";
import { useMeQuery } from "./lib/app_state/authApi";

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
          path="/dashboard"
          element={isAuthed ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={isAuthed ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
