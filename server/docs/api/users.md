## Users Endpoints

The following endpoints are available for users:

- POST /api/users/register:

Allows the user to register into the system. This endpoint in particular is special because it allows the first user to register as an admin and won't require any authentication. After the first user is registered, all subsequent users must be registered by an admin.

- PATCH /api/users/me/password:

Allows the currently authenticated user to change their password. It requires the current password, a new password, and a confirmation of the new password.

- GET /api/users/all:

Allows an admin to retrieve a list of all users in the system.

    - **Query Parameters**:
        - `sort_by`: Field to sort by (`full_name`, `email`, `role`, `is_active`, `created_at`, `updated_at`, `id`). Default: `full_name`.
        - `sort`: Sort direction (`asc` or `desc`). Default: `asc`.
        - `limit`: Integer. Limit the number of results.

- GET /api/users/<user_id>:

Allows an admin to retrieve the details of a specific user by their ID.

- PATCH /api/users/<user_id>/active:

Allows an admin to enable or disable a user account. It requires a boolean `is_active` field in the request body. Admins cannot change their own active status.

- DELETE /api/users/<user_id>:

Allows an admin to delete a user account. Admins cannot delete their own account.

You can refer to the ([Swagger](http://localhost:5000/apidocs)) for more information.
