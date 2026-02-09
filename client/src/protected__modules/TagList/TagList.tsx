import { useMemo, useState } from "react";
import { useAppSelector } from "../../lib/app_state/hooks";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useListTagsQuery,
  useRenameTagMutation,
} from "../../lib/app_state/tagApi";
import type { Tag, TagSortBy, TagSortDirection } from "../../models/tag";

const SORT_BY_OPTIONS: TagSortBy[] = ["name", "created_at", "id"];
const SORT_DIR_OPTIONS: TagSortDirection[] = ["asc", "desc"];
const LIMIT_OPTIONS = [5, 10, 15, 20];

const TagList = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAllowed = user?.role === "admin" || user?.role === "agent";
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<TagSortBy>("name");
  const [sortDir, setSortDir] = useState<TagSortDirection>("asc");
  const [limit, setLimit] = useState<number | undefined>(20);
  const [showCreate, setShowCreate] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [createTag, { isLoading: isCreating, isError: isCreateError, error }] =
    useCreateTagMutation();
  const [renameTag, { isLoading: isRenaming }] = useRenameTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const { data, isFetching, isError } = useListTagsQuery(
    isAllowed
      ? {
          sort_by: sortBy,
          sort: sortDir,
          limit,
        }
      : undefined,
    { skip: !isAllowed },
  );

  const filteredTags = useMemo(() => {
    const tags = data?.tags ?? [];
    const term = search.trim().toLowerCase();
    if (!term) {
      return tags;
    }
    return tags.filter((tag) => tag.name.toLowerCase().includes(term));
  }, [data, search]);

  if (!isAllowed) {
    return <div>Admins and agents only.</div>;
  }

  const handleCreate = async () => {
    if (!newTagName.trim()) {
      return;
    }
    try {
      await createTag({ name: newTagName.trim() }).unwrap();
      setNewTagName("");
      setShowCreate(false);
    } catch {
      // Mutation state handles errors.
    }
  };

  return (
    <div>
      <h1>Tags</h1>

      {isAdmin ? (
        <div>
          <button type="button" onClick={() => setShowCreate((prev) => !prev)}>
            {showCreate ? "Cancel" : "New tag"}
          </button>
          {showCreate ? (
            <div>
              <label htmlFor="newTagName">Tag name</label>
              <input
                id="newTagName"
                name="newTagName"
                type="text"
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
              />
              <button type="button" onClick={handleCreate} disabled={isCreating}>
                Create
              </button>
              {isCreateError ? (
                <div>
                  {typeof error === "object" && error && "status" in error
                    ? `Create failed (${error.status})`
                    : "Create failed"}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="tagSearch">Search</label>
        <input
          id="tagSearch"
          name="tagSearch"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          name="sortBy"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as TagSortBy)}
        >
          {SORT_BY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="sortDir">Sort direction</label>
        <select
          id="sortDir"
          name="sortDir"
          value={sortDir}
          onChange={(event) =>
            setSortDir(event.target.value as TagSortDirection)
          }
        >
          {SORT_DIR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="limit">Limit</label>
        <select
          id="limit"
          name="limit"
          value={limit}
          onChange={(event) => {
            const value = Number(event.target.value);
            setLimit(Number.isNaN(value) ? undefined : value);
          }}
        >
          {LIMIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isFetching ? <div>Loading...</div> : null}
      {isError ? <div>Failed to load tags.</div> : null}

      <ul>
        {filteredTags.length === 0 ? (
          <li>No tags found.</li>
        ) : (
          filteredTags.map((tag: Tag) => (
            <li key={tag.id}>
              <span>{tag.name}</span>
              {isAdmin ? (
                <span>
                  <button
                    type="button"
                    onClick={() => {
                      const name = window.prompt("New tag name", tag.name);
                      if (!name) {
                        return;
                      }
                      renameTag({ tag_id: tag.id, name: name.trim() });
                    }}
                    disabled={isRenaming}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        `Delete tag "${tag.name}"?`,
                      );
                      if (!confirmDelete) {
                        return;
                      }
                      deleteTag({ tag_id: tag.id });
                    }}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </span>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TagList;
