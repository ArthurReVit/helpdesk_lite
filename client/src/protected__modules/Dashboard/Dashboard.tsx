import { useAppSelector } from "../../lib/app_state/hooks";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <div>Content</div>
      {user ? (
        <div>
          <div>{user.full_name}</div>
          <div>{user.email}</div>
          <div>{user.role}</div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
