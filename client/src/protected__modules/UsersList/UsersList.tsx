import { useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  useDeleteUserMutation,
  useListUsersQuery,
  useSetUserActiveMutation,
} from "../../lib/app_state/userApi";
import type { UserSortBy, UserSortDirection, User } from "../../models/user";

const PAGE_SIZES = [5, 10, 15, 20] as const;

const UsersList = () => {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [sortBy, setSortBy] = useState<UserSortBy>("full_name");
  const [sortDir, setSortDir] = useState<UserSortDirection>("asc");

  const { data, isFetching, isError } = useListUsersQuery({
    sort: sortDir,
    sort_by: sortBy,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [setUserActive, { isLoading: isUpdatingActive }] =
    useSetUserActiveMutation();

  const filteredUsers = useMemo(() => {
    const users = data?.users ?? [];
    const term = search.trim().toLowerCase();
    if (!term) {
      return users;
    }
    return users.filter((user) => user.full_name.toLowerCase().includes(term));
  }, [data, search]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pageStart = pageIndex * pageSize;
  const pageUsers = filteredUsers.slice(pageStart, pageStart + pageSize);

  const handleSort = (column: UserSortBy) => {
    setPageIndex(0);
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const renderSortLabel = (column: UserSortBy, label: string) => {
    const active = sortBy === column;
    const suffix = active ? (sortDir === "asc" ? " ▲" : " ▼") : "";
    return `${label}${suffix}`;
  };

  return (
    <div>
      <h1>Users List</h1>

      <div>
        <label htmlFor="userSearch">Search by name</label>
        <input
          id="userSearch"
          name="userSearch"
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPageIndex(0);
          }}
        />
      </div>

      <div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          previousLabel="Prev"
          onPageChange={(selectedItem) => setPageIndex(selectedItem.selected)}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          forcePage={Math.min(pageIndex, pageCount - 1)}
          renderOnZeroPageCount={null}
        />

        <label htmlFor="pageSize">Users per page</label>
        <select
          id="pageSize"
          name="pageSize"
          value={pageSize}
          onChange={(event) => {
            setPageSize(
              Number(event.target.value) as (typeof PAGE_SIZES)[number],
            );
            setPageIndex(0);
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load users.</div> : null}

      <table>
        <thead>
          <tr>
            <th>
              <button type="button" onClick={() => handleSort("full_name")}>
                {renderSortLabel("full_name", "Full name")}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => handleSort("email")}>
                {renderSortLabel("email", "Email")}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => handleSort("role")}>
                {renderSortLabel("role", "Role")}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => handleSort("is_active")}>
                {renderSortLabel("is_active", "Is active")}
              </button>
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pageUsers.length === 0 ? (
            <tr>
              <td colSpan={4}>No users found.</td>
            </tr>
          ) : (
            pageUsers.map((user: User) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "Yes" : "No"}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      setUserActive({
                        user_id: user.id,
                        is_active: !user.is_active,
                      })
                    }
                    disabled={isUpdatingActive}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUser({ user_id: user.id })}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
