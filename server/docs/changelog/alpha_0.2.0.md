# Alpha 0.2.0

## Changes

- Improved the `PATCH /api/users/me/password` endpoint logic to support password validation. It now requires the current password and confirmation.
- Enhanced the `GET /api/users/all` endpoint with support for sorting (`sort`, `sort_by`) and `limit` query parameters.
- Implemented and documented the `GET /api/users/all`, `GET /api/users/<user_id>`, `PATCH /api/users/<user_id>/active` and `DELETE /api/users/<user_id>` endpoints for admin management.
- Documented the user management endpoints in the [User API Documentation](../api/users.md).
- Created Swagger specifications for the new user management features under `docs/swagger/users/`.
- Integrated the Swagger documentation with the API using `swag_from`.

## Bug fixes

- Fixed a security gap in the password change endpoint by requiring the current password.

## Notes

- This update focuses on security and documentation consistency.
- The Swagger doc for this endpoint is now modularized following the new project structure.
