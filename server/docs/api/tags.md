## Tags Endpoints

The following endpoints are available for tag management:

- GET /api/tags/:

Allows users to retrieve a list of all tags.

- **Query Parameters**:
  - `sort_by`: Field to sort by (`name`, `created_at`, `id`). Default: `name`.
  - `sort`: Sort direction (`asc` or `desc`). Default: `asc`.
  - `limit`: Integer. Limit the number of results.

- GET /api/tags/<tag_id>:

Allows users to retrieve the details of a specific tag by its ID.

- PATCH /api/tags/<tag_id>:

Allows an admin to rename an existing tag.

- **Requirements**:
  - Admin privileges (JWT required).
  - `name` field in the JSON body (max 20 characters).
- **Constraints**:
  - New tag name must be unique and not already in use.

- DELETE /api/tags/<tag_id>:

Allows an admin to delete an existing tag.

- **Requirements**:
  - Admin privileges (JWT required).

- POST /api/tags/:

Allows an admin to create a new tag. Tags are used to categorize tickets.

- **Requirements**:
  - Admin privileges (JWT required).
  - `name` field in the JSON body (max 20 characters).
- **Constraints**:
  - Tag name must be unique.

You can refer to the ([Swagger](http://localhost:5000/apidocs)) for more information.
